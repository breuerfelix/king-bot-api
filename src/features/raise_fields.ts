import { feature_collection, feature_item, Ioptions, Ifeature } from './feature';
import { find_state_data, sleep, get_diff_time } from '../util';
import logger from '../logger';
import { village } from '../gamedata';
import { Ibuilding, Ivillage, Ibuilding_queue, Iresources, Iplayer, Ibuilding_collection } from '../interfaces';
import api from '../api';
import finish_earlier from './finish_earlier';

interface Ioptions_raise extends Ioptions {
	[index: string]: any
	village_name: string
	crop: number
	wood: number
	clay: number
	iron: number
}

class raise_fields extends feature_collection {
	get_ident(): string {
		return 'raise_fields';
	}

	get_new_item(options: Ioptions_raise): raise {
		return new raise({ ...options });
	}

	get_default_options(options: Ioptions): Ioptions_raise {
		return {
			...options,
			village_name: '',
			crop: 0,
			wood: 0,
			iron: 0,
			clay: 0
		};
	}
}

class raise extends feature_item {
	building_type: { [index: number]: number, wood: number, clay: number, iron: number, crop: number } = {
		wood: 1,
		clay: 2,
		iron: 3,
		crop: 4
	}

	building_type_reverse: { [index: number]: string } = {
		1: 'wood',
		2: 'clay',
		3: 'iron',
		4: 'crop'
	}

	options: Ioptions_raise;

	set_options(options: Ioptions_raise): void {
		const { uuid, run, error, village_name, crop, iron, wood, clay } = options;
		this.options = {
			...this.options,
			uuid,
			run,
			error,
			village_name,
			crop,
			iron,
			wood,
			clay
		};
	}

	get_options(): Ioptions_raise {
		return { ...this.options };
	}

	set_params(): void {
		this.params = {
			ident: 'raise_fields',
			name: 'raise fields'
		};
	}

	get_description(): string {
		const { village_name } = this.options;

		if (!village_name) return '-';

		return village_name;
	}

	get_long_description(): string {
		return 'this feature will raise all your fields to a given level on it\'s own. it will always upgrade the type which got the lowest storage.';
	}

	async upgrade_field(): Promise<number> {
		const { village_name } = this.options;

		let params: string[] = [];
		const villages_data: any = await village.get_own();
		const village_obj: Ivillage = village.find(village_name, villages_data);
		params.push(village.building_collection_ident + village_obj.villageId);
		params.push(village.building_queue_ident + village_obj.villageId);

		// fetch latest data needed
		let response: any[] = await api.get_cache(params);

		let sleep_time: number = null;

		const queue_data: Ibuilding_queue = find_state_data(village.building_queue_ident + village_obj.villageId, response);

		// skip if resource slot is used
		if (queue_data.freeSlots[2] == 0) {
			// set sleep time
			let finished: number = null;

			if (queue_data.queues[2].length) {
				finished = queue_data.queues[2][0].finished;
			} else if (queue_data.queues[1].length) {
				finished = queue_data.queues[1][0].finished;
			} else {
				logger.error('error calculating queue time! queue object:');
				logger.error(queue_data.queues);
				this.options.error = true;
				return null;
			}

			logger.info('queue for raise field is not free for ' + String(get_diff_time(finished)) + ' seconds', 'raise fields');
			return get_diff_time(finished);
		}

		// village got free res slot
		const village_data: Ibuilding_collection[] = find_state_data(village.building_collection_ident + village_obj.villageId, response);

		// sort resource type by it's storage
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
		let done: boolean = true;

		// iterate over resource by its priority based on production
		for (let res of sorted_res_types) {
			let lowest_building: Ibuilding = this.lowest_building_by_type(res, village_data);

			if (!lowest_building) continue;

			// build until all res fields are this lvl
			if (Number(lowest_building.lvl) < Number(this.options[this.building_type_reverse[res]])) {
				done = false;

				if (this.able_to_build(lowest_building, village_obj)) {
					upgrade_building = lowest_building;
					break;
				}

				// check later if there might be enough res
				sleep_time = 60;
			}
		}

		// all fields are raised
		if (done) {
			logger.info('raise fields done !', 'raise fields');
			return null;
		}

		if (upgrade_building) {
			// upgrade building
			const res: any = await api.upgrade_building(upgrade_building.buildingType, upgrade_building.locationId, village_obj.villageId);
			logger.info('upgrade building ' + upgrade_building.locationId + ' on village ' + village_obj.name, 'raise fields');

			const upgrade_time: number = Number(upgrade_building.upgradeTime);

			// check if building time is less than 5 min
			if (get_diff_time(upgrade_time) <= (5 * 60)) {
				await api.finish_now(village_obj.villageId, 2);
				logger.info('upgrade time less 5 min, instant finish!', 'raise fields');

				// only wait one second to build next building
				return 1;
			}

			// set sleep time
			if (!sleep_time) sleep_time = upgrade_time;
			else if (upgrade_building.upgradeTime < sleep_time) sleep_time = upgrade_time;
		}

		return sleep_time;
	}

	async run(): Promise<void> {
		logger.info(`raise fields: ${this.options.uuid} started`, 'raise fields');

		while (this.options.run) {
			let sleep_time: number = await this.upgrade_field();
			logger.debug('return sleep time is ' + String(sleep_time));

			// all fields are raised
			if (!sleep_time) {
				logger.info('finished raising fields.', 'raise fields');
				break;
			}

			if (sleep_time && sleep_time > ((5 * 60) + 10) && finish_earlier.running) sleep_time = sleep_time - (5 * 60) + 10;

			// set save sleep time
			if (!sleep_time || sleep_time <= 0) sleep_time = 60;
			if (sleep_time > 300) sleep_time = 300;

			logger.debug('actual sleep time is ' + String(sleep_time));
			await sleep(sleep_time);
		}

		this.running = false;
		this.options.run = false;
		logger.info(`raise fields: ${this.options.uuid} stopped`, 'raise fields');
	}

	able_to_build(building: Ibuilding, village: Ivillage): boolean {
		for (let res in village.storage)
			if (Number(village.storage[res]) < Number(building.upgradeCosts[res])) return false;

		return true;
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

export default new raise_fields();
