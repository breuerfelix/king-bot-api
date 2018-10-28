import { Ivillage, Ibuilding_queue, Ifeature, Irequest } from './interfaces';
import { log, get_date, clash_obj, find_state_data } from './util';
import { sleep } from './util';
import api from './api';
import village from './village';
import database from './database';

interface options {
	run: boolean
	error: boolean
}

interface Ifeature_fe extends Ifeature, options {}

interface Irequest_fe extends Irequest {
	feature: Ifeature_fe
}

class finish_earlier {
	finish_earlier: boolean = false;

	building_queue_ident: string = 'BuildingQueue:';

	options: options = null;
	running: boolean = false;

	constructor() {
		this.options = database.get('finish_ealier.options').value();
		if(!this.options) {
			this.options = {
				run: false,
				error: false
			}
		}
	}

	handle_request(payload: Irequest_fe): any {
		const { action } = payload;

		if(action == 'start') {
			this.options.run = true;
			if(!this.running) this.start();
			return 'online';
		}

		if(action == 'stop') {
			this.stop();
			return 'offline';
		}

		return 'error';

	}

	get_feature_params(): Ifeature_fe {
		const params: any = {
			ident: 'finish_earlier',
			name: 'instant finish',
			description: '5 min earlier',
			...this.options
		};

		return params;
	}

	// server startup start
	start(): void {
		this.upgrade_earlier();
	}

	stop(): void {
		this.options.run = false;
		database.set('finish_earlier.options', this.options).write();
	}

	async upgrade_earlier(): Promise<void> {
		try {
			this.running = true;
			log('finish earlier started');

			database.set('finish_earlier.options', this.options).write();

			const five_minutes: number = 5 * 60;

			while(true) {
				const villages_data: any = await village.get_own();

				let params: string[] = [];

				for(let data of find_state_data(village.own_villages_ident, villages_data)) {
					const vill: Ivillage = data.data;
					params.push(this.building_queue_ident + vill.villageId);
				}

				// fetch latest data needed
				let response: any[] = await api.get_cache(params);

				let sleep_time: number = null;

				for(let data of find_state_data(village.own_villages_ident, villages_data)) {
					const vill: Ivillage = data.data;
					const queue: Ibuilding_queue = find_state_data(this.building_queue_ident + vill.villageId, response);

					const queues: number[] = [1, 2];

					// for building and resource queue
					for(let qu of queues) {
						const actual_queue: any[] = queue.queues[qu];

						if(!actual_queue) continue;
						if(!actual_queue[0]) continue;

						const first_item: any = actual_queue[0];
						const finished: number = first_item.finished;
						const now: number = get_date();

						const rest_time: number = finished - now;

						// finish building instant
						if(rest_time <= five_minutes) {
							const res = await api.finish_now(vill.villageId, qu);
							console.log(`finished building earlier for free in village ${vill.name}`);
							continue;
						}

						if(!sleep_time) sleep_time = rest_time;
						else if(rest_time < sleep_time) sleep_time = rest_time;
					}
				}

				if(sleep_time) sleep_time = sleep_time - five_minutes + 1;
				
				if(!sleep_time || sleep_time <= 0) sleep_time = 60;
				if(sleep_time > 300) sleep_time = 300;

				await sleep(sleep_time);
			}

			log('finish earlier stopped');
			this.running = false;

		} catch {
			log('finish earlier error');
			this.running = false;
			this.options.error = true;
			this.options.run = false;
		}
	}
}

export default new finish_earlier();
