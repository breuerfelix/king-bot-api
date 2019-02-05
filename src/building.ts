import { Ivillage, Ibuilding, Ibuilding_collection, Ibuilding_queue } from './interfaces';
import { log, get_date, clash_obj, find_state_data } from './util';
import { sleep } from './util';
import api from './api';
import { village } from './gamedata';

class building_queue {
	building_type: { [index: number]: number, wood: number, clay: number, iron: number, crop: number } = {
		wood: 1,
		clay: 2,
		iron: 3,
		crop: 4
	}

	running: boolean = false;
	loop_data: { [index: string]: [{ [index: number]: number[] }] } = {};
	finish_earlier: boolean = false;

	building_collection_ident: string = 'Collection:Building:';
	building_ident: string = 'Building:';
	building_queue_ident: string = 'BuildingQueue:';

	// reads in loop data
	upgrade_res(resources: Iresource_type, village_name: string): void {
		const data: { [index: number]: number[] } = {};

		for (let t in resources) {
			data[this.building_type[t]] = resources[t];
		}

		if (this.loop_data[village_name]) this.loop_data[village_name].push(data);
		else this.loop_data[village_name] = [data];

		if (!this.running){
			this.running = true;
			this.run();
		}
	}

	async upgrade_earlier(): Promise<void> {
		this.finish_earlier = true;
		const five_minutes: number = 5 * 60;

		while (true) {
			const villages_data: any = await village.get_own();

			let params: string[] = [];

			for (let data of find_state_data(village.own_villages_ident, villages_data)) {
				const vill: Ivillage = data.data;
				params.push(this.building_queue_ident + vill.villageId);
			}

			// fetch latest data needed
			let response: any[] = await api.get_cache(params);

			let sleep_time: number = null;

			for (let data of find_state_data(village.own_villages_ident, villages_data)) {
				const vill: Ivillage = data.data;
				const queue: Ibuilding_queue = find_state_data(this.building_queue_ident + vill.villageId, response);

				const queues: number[] = [1, 2];

				// for building and resource queue
				for (let qu of queues) {
					const actual_queue: any[] = queue.queues[qu];

					if (!actual_queue) continue;
					if (!actual_queue[0]) continue;

					const first_item: any = actual_queue[0];
					const finished: number = first_item.finished;
					const now: number = get_date();

					const rest_time: number = finished - now;

					// finish building instant
					if (rest_time <= five_minutes) {
						const res = await api.finish_now(vill.villageId, qu);
						console.log(`finished building earlier for free in village ${vill.name}`);
						continue;
					}

					if (!sleep_time) sleep_time = rest_time;
					else if (rest_time < sleep_time) sleep_time = rest_time;
				}
			}

			if (sleep_time) sleep_time = sleep_time - five_minutes + 1;

			if (!sleep_time || sleep_time <= 0) sleep_time = 60;
			if (sleep_time > 300) sleep_time = 300;

			await sleep(sleep_time);
		}
	}

	// runs actual resource loop data
	async run(): Promise<void> {
		// sleep timer so the loop data gets filled up with all villages
		await sleep(5);

		while (true) {
			let params: string[] = [];

			const villages_data: any = await village.get_own();

			for (let vill in this.loop_data) {
				const village_obj: Ivillage = village.find(vill, villages_data);

				params.push(this.building_collection_ident + village_obj.villageId);
				params.push(this.building_queue_ident + village_obj.villageId);
			}

			// fetch latest data needed
			let response: any[] = await api.get_cache(params);

			let sleep_time: number = null;

			for (const vill in this.loop_data) {
				const village_obj: Ivillage = village.find(vill, villages_data);

				const queue_data: Ibuilding_queue = find_state_data(this.building_queue_ident + village_obj.villageId, response);

				// skip if resource slot is used
				if (queue_data.freeSlots[2] == 0) {
					// set sleep time
					const finished: number = queue_data.queues[2][0].finished;
					const now: number = get_date();

					const rest_time: number = finished - now;

					if (!sleep_time) sleep_time = rest_time;
					else if (rest_time < sleep_time) sleep_time = rest_time;

					continue;
				}

				// village got free res slot
				const village_data: Ibuilding_collection[] = find_state_data(this.building_collection_ident + village_obj.villageId, response);

				// sort resource type by it's production
				const sorted_res_types: number[] = [];
				const temp_res_prod: number[] = [];
				const temp_dict: { [index: number]: number } = {};

				for (let res in village_obj.production) {
					// let prod: number = village_obj.production[res];
					let current_res: number = Number(village_obj.storage[res]);
					let storage: number = Number(village_obj.storageCapacity[res]);

					// calculate percentage of current resource
					let percent: number = current_res / (storage / 100);

					// add 30 percent storage to crop, since its not that needed
					if (res == '4') percent += 30;

					temp_res_prod.push(percent);
					temp_dict[percent] = Number(res);
				}

				// sort lowest is first by number
				temp_res_prod.sort((x1, x2) => Number(x1) - Number(x2));

				for (let prod of temp_res_prod) {
					sorted_res_types.push(temp_dict[prod]);
				}

				// queue loop
				let upgrade_building: Ibuilding = null;
				for (const queue of this.loop_data[vill]) {
					// iterate over resource by its priority based on production
					for (let res of sorted_res_types) {
						// res type not given
						if (!queue[res]) continue;

						// sort array lowest number will be first
						const sorted_queue: number[] = [...queue[res]];
						sorted_queue.sort((x1, x2) => x1 - x2);

						let lowest_building: Ibuilding = this.lowest_building_by_type(res, village_data);

						// build until all res fields are this lvl
						if (Number(lowest_building.lvl) < Number(sorted_queue[0])) {
							if (this.able_to_build(lowest_building, village_obj)) {
								upgrade_building = lowest_building;
								break;
							}

							// if not possible to build just go to next res type
							continue;
						}

						// splice away the lowest building level
						let new_queue: number[] = [...sorted_queue];
						new_queue = new_queue.splice(1);
						const new_building_data: Ibuilding[] = this.get_building_collection_above_level(res, sorted_queue[0], village_data);

						for (let i: number = 0; i < new_queue.length; i++) {
							let temp_lowest: Ibuilding = null;

							// get lowest building if possible
							new_building_data.forEach(x => {
								if (Number(x.lvl) >= Number(new_queue[i])) {
									if (!temp_lowest) {
										temp_lowest = x;
									} else {
										if (Number(x.lvl) < Number(temp_lowest.lvl)) temp_lowest = x;
									}
								}
							});

							// delete from queue and continue to next level
							if (temp_lowest) {
								delete new_building_data[new_building_data.indexOf(temp_lowest)];
								continue;
							}

							// upgrade highest building which is lower than required level
							const to_upgrade: Ibuilding = this.get_highest_level_until(res, new_queue[i], village_data);

							if (!to_upgrade) break;

							if (this.able_to_build(to_upgrade, village_obj)) {
								upgrade_building = to_upgrade;
							}

							break;
						}

						if (upgrade_building) break;
					}

					if (upgrade_building) break;
				}

				if (upgrade_building) {
					// upgrade building
					const res: any = await api.upgrade_building(upgrade_building.buildingType, upgrade_building.locationId, village_obj.villageId);
					if (res.errors) {
						//TODO delete this console log
						console.log('error upgrading building');
					}

					// set sleep time
					if (!sleep_time) sleep_time = upgrade_building.upgradeTime;
					else if (upgrade_building.upgradeTime < sleep_time) sleep_time = upgrade_building.upgradeTime;

					console.log('upgrade building ' + upgrade_building.locationId + ' on village ' + vill);
				}
			}

			if (sleep_time && this.finish_earlier) sleep_time = sleep_time - (5 * 60) + 10;

			// set save sleep time
			if (!sleep_time || sleep_time <= 0) sleep_time = 60;
			if (sleep_time > 300) sleep_time = 300;

			await sleep(sleep_time);
		}
	}

	get_building_collection_above_level(type: number, level: number, org_collection: Ibuilding_collection[]): Ibuilding[] {
		const rv: Ibuilding[] = [];

		for (const item of org_collection) {
			if (item.data.buildingType == type)
				if (Number(item.data.lvl) > Number(level))
					rv.push(item.data);
		}

		return rv;
	}

	get_highest_level_until(building_type: number, max_level: number, building_collection: Ibuilding_collection[]): Ibuilding {
		let rv: Ibuilding = null;

		for (const building of building_collection) {
			if (building.data.buildingType == building_type) {
				if (Number(building.data.lvl) < Number(max_level)) {
					if (!rv) rv = building.data;
					else if (Number(building.data.lvl) > Number(rv.lvl)) rv = building.data;
				}
			}
		}

		return rv;
	}

	able_to_build(building: Ibuilding, village: Ivillage): boolean {
		for (let res in village.storage)
			if (Number(village.storage[res]) < Number(building.upgradeCosts[res])) return false;

		return true;
	}

	min_value(arr: number[]): number {
		if (arr.length < 1) return 0;

		let min: number = arr[0];

		for (let item of arr) {
			if (Number(item) < Number(min)) min = item;
		}

		return min;
	}

	lowest_building_by_type(type: number, building_collection: Ibuilding_collection[]): Ibuilding {
		let rv: Ibuilding = null;

		for (let building of building_collection) {
			const bd: Ibuilding = building.data;

			if (bd.buildingType != type) continue;

			if (!rv) {
				rv = bd;
				continue;
			}

			if (Number(bd.lvl) < Number(rv.lvl)) rv = bd;
		}

		return rv;
	}
}

export interface Iresource_type {
	[index: number]: number[]
	clay?: number[]
	iron?: number[]
	wood?: number[]
	crop?: number[]
}

export default new building_queue();
