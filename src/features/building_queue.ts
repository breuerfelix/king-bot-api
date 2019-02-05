import { feature_collection, feature_item, Ioptions, Ifeature } from './feature';
import { log, find_state_data, sleep, get_diff_time } from '../util';
import { village, player } from '../gamedata';
import { Ivillage, Ibuilding_queue, Iresources, Iplayer } from '../interfaces';
import { tribe } from '../data';
import api from '../api';
import logger from '../logger';
import finish_earlier from './finish_earlier';
import { buildings } from '../data';

interface Ioptions_queue extends Ioptions {
	village_name: string
	queue: Iqueue[]
}

interface Iqueue {
	type: number
	location: number
	costs: Iresources
	upgrade_time: number
}

class building_queue extends feature_collection {
	get_ident(): string {
		return 'queue';
	}

	get_new_item(options: Ioptions_queue): queue {
		return new queue({ ...options });
	}

	get_default_options(options: Ioptions): Ioptions_queue {
		return {
			...options,
			village_name: '',
			queue: []
		};
	}
}

class queue extends feature_item {
	options: Ioptions_queue;

	set_options(options: Ioptions_queue): void {
		const { uuid, run, error, village_name, queue } = options;
		this.options = {
			...this.options,
			uuid,
			run,
			error,
			village_name,
			queue: [ ...queue ]
		};
	}

	get_options(): Ioptions_queue {
		return { ...this.options };
	}

	set_params(): void {
		this.params = {
			ident: 'queue',
			name: 'building queue'
		};
	}

	get_description(): string {
		const { village_name } = this.options;

		let des: string = village_name;

		if (!village_name) return '-';

		return des;
	}

	get_long_description(): string {
		return 'this is an endless building queue. don\'t change the village once it\'s set. if you want to change the village, just do another building queue feature with your desired village';
	}

	async run(): Promise<void> {
		logger.info(`building queue: ${this.options.uuid} started`, 'building queue');

		while (this.options.run) {
			const { village_name, queue } = this.options;
			if (queue.length < 1) break;
			const queue_item: Iqueue = queue[0];

			let params: string[] = [];

			const villages_data: any = await village.get_own();

			const village_obj: Ivillage = village.find(village_name, villages_data);

			params.push(village.building_queue_ident + village_obj.villageId);

			// fetch latest data needed
			let response: any[] = await api.get_cache(params);

			let sleep_time: number = null;

			const queue_data: Ibuilding_queue = find_state_data(village.building_queue_ident + village_obj.villageId, response);

			let free: boolean = true;

			if (queue_item.type < 5) {
				// resource slot
				if (queue_data.freeSlots[2] == 0) free = false;
			} else {
				// building slot
				if (queue_data.freeSlots[1] == 0) free = false;
			}

			let finished: number;
			if (!free) {
				if (queue_data.queues[2][0])
					finished = queue_data.queues[2][0].finished;
				else if (queue_data.queues[1][0])
					finished = queue_data.queues[1][0].finished;
			}

			if (finished) {
				const res_time: number = get_diff_time(finished);

				if (res_time > 0) sleep_time = res_time;
			}

			if (free) {
				// upgrade building here
				if (this.able_to_build(queue_item.costs, village_obj)) {
					const res: any = await api.upgrade_building(queue_item.type, queue_item.location, village_obj.villageId);
					logger.info('upgrade building ' + queue_item.location + ' on village ' + village_obj.name, 'building queue');

					// TODO save new options to database
					this.options.queue.shift();

					const upgrade_time: number = Number(queue_item.upgrade_time);

					if (get_diff_time(upgrade_time) <= (5 * 60)) {
						await api.finish_now(village_obj.villageId, 2);
						logger.info('upgrade time less 5 min, instant finish!', 'building queue');

						// only wait one second to build next building
						sleep_time = 1;
					}

					if (!sleep_time) sleep_time = upgrade_time;
					else if (upgrade_time < sleep_time) sleep_time = upgrade_time;
				} else {
					// check again later if there might be enough res
					sleep_time = 60;
				}
			}

			if (sleep_time && sleep_time > ((5 * 60) + 10) && finish_earlier.running)
				sleep_time = sleep_time - (5 * 60) + 10;

			// set save sleep time
			if (!sleep_time || sleep_time <= 0) sleep_time = 120;
			if (sleep_time > 300) sleep_time = 300;

			if (free) {
				// start fast over for romans, if next is resource field
				const player_data: Iplayer = await player.get();
				const own_tribe: tribe = player_data.tribeId;
				if (own_tribe == tribe.roman) sleep_time = 10;
			}

			await sleep(sleep_time);
		}

		this.running = false;
		this.options.run = false;
		logger.info(`building queue: ${this.options.uuid} stopped`, 'building queue');
	}

	able_to_build(costs: Iresources, village: Ivillage): boolean {
		for (let res in village.storage)
			if (Number(village.storage[res]) < Number(costs[res])) return false;

		return true;
	}
}

export default new building_queue();
