import { log, find_state_data, sleep, list_remove, get_random_int, get_date } from '../util';
import { Ifarmlist, Ivillage } from '../interfaces';
import { Ifeature, Irequest, feature_collection, feature_item, Ioptions } from './feature';
import { farming, village } from '../gamedata';
import api from '../api';
import database from '../database';
import uniqid from 'uniqid';

interface Ioptions_farm extends Ioptions {
	village_name: string
	farmlists: string[]
	interval_min: number
	interval_max: number
}

class send_farmlist extends feature_collection {
	get_ident(): string {
		return 'farming';
	}

	get_new_item(options: Ioptions_farm): farm_feature {
		return new farm_feature({ ...options });
	}

	get_default_options(options: Ioptions): Ioptions_farm {
		return {
			...options,
			village_name: '',
			farmlists: [],
			interval_min: 0,
			interval_max: 0,
		};
	}
}

class farm_feature extends feature_item {
	options: Ioptions_farm;

	set_options(options: Ioptions_farm): void {
		const { uuid, run, error, village_name, farmlists, interval_min, interval_max } = options;
		this.options = {
			...this.options,
			uuid,
			run,
			error,
			village_name,
			farmlists,
			interval_min,
			interval_max
		};
	}

	get_options(): Ioptions_farm {
		return { ...this.options };
	}

	set_params(): void {
		this.params = {
			ident: 'farming',
			name: 'send farmlist'
		};
	}

	get_description(): string {
		const { interval_min, interval_max, village_name } = this.options;
		return `${village_name} / ${interval_min} - ${interval_max} s`;
	}

	get_long_description(): string {
		return 'this feature will just send the farmlist in a given interval.';
	}

	async run(): Promise<void> {
		log(`farming uuid: ${this.options.uuid} started`);

		const { farmlists, interval_min, interval_max } = this.options;
		var params = [
			village.own_villages_ident,
			farming.farmlist_ident
		];

		// fetch farmlists
		const response = await api.get_cache(params);

		while (this.options.run) {

			const { interval_min, village_name, farmlists } = this.options;

			const vill: Ivillage = village.find(village_name, response);
			const village_id: number = vill.villageId;

			const farmlist_ids: number[] = [];

			for (let farm of farmlists) {
				let farmlist_id: number = NaN;
				const list_obj = farming.find(farm, response);

				const lastSent: number = Number(list_obj.lastSent);
				const now: number = get_date();

				if ((now - lastSent) < interval_min) {
					log(`farmlist: ${farm} sent too recently. skipping until next time`);
					continue;
				}

				farmlist_ids.push(list_obj.listId);
			}

			await api.send_farmlists(farmlist_ids, village_id);
			log(`farmlists: ${farmlists} sent from village ${village_name}`);

			await sleep(get_random_int(interval_min, interval_max));
		}

		log(`farming uuid: ${this.options.uuid} stopped`);
		this.running = false;
		this.options.run = false;
	}
}

export default new send_farmlist();
