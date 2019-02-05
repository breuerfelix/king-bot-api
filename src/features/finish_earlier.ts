import { Ivillage, Ibuilding_queue } from '../interfaces';
import { Ifeature, feature_single, Ioptions, Iresponse } from './feature';
import { log, get_date, clash_obj, find_state_data, sleep } from '../util';
import api from '../api';
import { village } from '../gamedata';
import uniqid from 'uniqid';
import database from '../database';

class finish_earlier extends feature_single {
	building_queue_ident: string = 'BuildingQueue:';

	options: Ioptions;

	set_default_options(): void {
		this.options = {
			uuid: uniqid.time(),
			run: false,
			error: false
		};
	}

	set_params(): void {
		this.params = {
			ident: 'finish_earlier',
			name: 'instant finish'
		};
	}

	get_description(): string {
		return '5 min earlier';
	}

	set_options(options: Ioptions): void {
		const { run, error, uuid } = options;
		this.options = {
			...this.options,
			uuid,
			run,
			error
		};

	}

	get_options(): Ioptions {
		return { ...this.options };
	}

	update(options: Ioptions): Iresponse {
		return {
			error: false,
			data: null,
			message: ''
		};
	}

	async run(): Promise<void> {
		log('finish earlier started');

		const five_minutes: number = 5 * 60;

		while (this.options.run) {
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
			if (sleep_time > 120) sleep_time = 120;

			await sleep(sleep_time);
		}

		log('finish earlier stopped');
		this.running = false;
		this.options.run = false;
	}
}

export default new finish_earlier();
