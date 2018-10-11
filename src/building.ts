import { Ivillage, Ibuilding, Ibuilding_collection, Ibuilding_queue } from './interfaces';
import state from './state';
import { log } from './util';
import { sleep } from './util';
import api from './api';

class building_queue {
	building_type: { [index: number]: number, wood: number, clay: number, iron: number, crop: number } = {
		wood: 1,
		clay: 2,
		iron: 3,
		crop: 4
	}

	running: boolean = false;
	loop_data: { [index: string]: [{ [index: number]: number[] }] } = {};

	building_collection_ident: string = 'Collection:Building:';
	building_ident: string = 'Building:';
	building_queue_ident: string = 'BuildingQueue:';

	// reads in loop data
	upgrade_res(resources: Iresource_type, village_name: string): void {
		const village: Ivillage | null = state.get_village(village_name);

		if(!village) {
			log(`village ${village_name} could not be found`);
			return;
		}

		const data: { [index: number]: number[] } = {};
		
		for(let t in resources) {
			data[this.building_type[t]] = resources[t];
		}

		if(this.loop_data[village_name]) this.loop_data[village_name].push(data);
		else this.loop_data[village_name] = [data];

		if(!this.running){
			this.running = true;
			this.run();
		}
	}
	
	// runs actual resource loop data
	async run(): Promise<void> {
		// sleep timer so the loop data gets filled up with all villages
		await sleep(2);
		
		while(true) {
			let params: string[] = [];

			for(let village in this.loop_data) {
				const village_obj: Ivillage = state.get_village(village);
				params.push(this.building_collection_ident + village_obj.villageId);
				params.push(this.building_queue_ident + village_obj.villageId);
				params.push(state.village_ident + 'own');
			}

			// fetch latest data needed
			await api.get_cache(params);

			for(const village in this.loop_data) {
				const village_obj: Ivillage = state.get_village(village);

				const queue_data: Ibuilding_queue = state.find(this.building_queue_ident + village_obj.villageId);
				// skip if resource slot is used
				// TODO uncomment below
				//if(queue_data.freeSlots[2] == 0) continue;
				
				// village got free res slot
				console.log('village got a free slot: ' + village)

				const village_data: Ibuilding_collection[] = state.find(this.building_collection_ident + village_obj.villageId);

				let upgrade_building: Ibuilding = null;
				for(const queue of this.loop_data[village]) {
					const sorted_res_types: number[] = [1,2,3,4];
					// TODO sort res type by production per hour
					
					// iterate over resource by its priority based on production
					for(let res of sorted_res_types) {
						// res type not given
						if(!queue[res]) continue;

						// sort array lowest number will be first
						const sorted_queue: number[] = queue[res].sort((x1, x2) => x1 - x2);
						console.log(sorted_queue)

						let lowest_building: Ibuilding = this.lowest_building_by_type(res, village_data);

						if(lowest_building.lvl < sorted_queue[0]) {
							// build until all res fields are this lvl
							if(this.able_to_build(lowest_building, village_obj)) {
								upgrade_building = lowest_building;
								break;
							}

							// if not possible to build just go to next res type
							continue;
						}
	
						// if lvl is equal or greater switch to next type
	
						// else try upgrade this type
	
						// if not possible goto second lowest prod and repeat

						//queue[res] = queue[res].sort((x1, x2) => x1 - x2);
						//const queue: number[] = qu.sort((x1, x2) => x1 - x2);
					}
					
					if(upgrade_building) break;
				}

				if(upgrade_building) {
					// upgrade this building
					// TODO uncomment below
					//await api.upgrade_building(upgrade_building.buildingType, upgrade_building.locationId, village_obj.villageId);
					console.log('upgrade building ' + upgrade_building.locationId + ' on village ' + village);
				}
			}

			// calculate sleep time
			for(let village in this.loop_data) {

			}

			break;
			sleep(10);
		}
	}

	able_to_build(building: Ibuilding, village: Ivillage): boolean {
		for(let res in village.storage)
			if(village.storage[res] < building.upgradeCosts[res]) return false;

		return true;
	}

	min_value(arr: number[]): number {
		if(arr.length < 1) return 0;

		let min: number = arr[0];

		for(let item of arr) {
			if(item < min) min = item;
		}

		return min;
	}

	lowest_building_by_type(type: number, building_collection: Ibuilding_collection[]): Ibuilding {
		let rv: Ibuilding = null;
		
		for(let building of building_collection) {
			const bd: Ibuilding = building.data;

			if(bd.buildingType != type) continue;

			if(!rv) {
				rv = bd;
				continue;
			}

			if(bd.lvl < rv.lvl) rv = bd;
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

// list mit buildings
// wenn neues dazu kommt, adden
// bei jedem run einmal queue fetchen
// einach die queue pro building veraendern
//
// find village, storage = current resources
// free slots 1 und 2 sind frei heisst ich kann bauen !
//canuseinstantcontructiononlyinvillage = finish 5 min ealier
//
