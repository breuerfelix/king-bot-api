import { log, find_state_data, sleep, list_remove, get_random_int, get_date } from '../util';
import { Ifarmlist, Ivillage } from '../interfaces';
import { Ifeature, Irequest, feature_collection, feature_item, Ioptions } from './feature';
import { farming, village } from '../gamedata';
import api from '../api';
import database from '../database';
import uniqid from 'uniqid';
import { clean_farmlist } from '../utilities/clean_farmlist';

interface Ioptions_farm extends Ioptions {
	farmlists: any[]
	losses_farmlist: string
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
			farmlists: [],
			interval_min: 0,
			interval_max: 0,
			losses_farmlist: ''
		};
	}
}

class farm_feature extends feature_item {
	options: Ioptions_farm;

	set_options(options: Ioptions_farm): void {
		const { uuid, run, error, farmlists, losses_farmlist, interval_min, interval_max } = options;
		this.options = {
			...this.options,
			uuid,
			run,
			error,
			farmlists,
			interval_min,
			interval_max,
			losses_farmlist
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
		const { interval_min, interval_max } = this.options;
		return ` Farmlist: ${interval_min} - ${interval_max} s`;
	}

	get_long_description(): string {
		return 'this feature will just send the farmlist in a given interval.';
	}

	async run(): Promise<void> {
		log(`farming uuid: ${this.options.uuid} started`);

		const params = [
			village.own_villages_ident,
			farming.farmlist_ident
		];

		// fetch farmlists
		const response = await api.get_cache(params);

		while (this.options.run) {

			const { interval_min, interval_max, farmlists, losses_farmlist } = this.options;

			const farmlists_to_send: any = {};

			for (let farmlistinfo of farmlists) {
				const list_obj = farming.find(farmlistinfo.farmlist, response);
				const vill: Ivillage = village.find(farmlistinfo.village_name, response);
				const village_id: number = vill.villageId;

				const lastSent: number = Number(list_obj.lastSent);
				const now: number = get_date();

				if ((now - lastSent) < interval_min) {
					log(`farmlist: ${farmlistinfo.farmlist} sent too recently. skipping until next time`);
					continue;
				}

				if (losses_farmlist != '') {
					const losses_list_obj = farming.find(losses_farmlist, response);
					const losses_id = losses_list_obj.listId;
					const clean_done = await clean_farmlist(list_obj.listId, losses_id);
					if (!farmlists_to_send[village_id]) {
						farmlists_to_send[village_id] = [];
					}
					if (clean_done) farmlists_to_send[village_id].push(list_obj.listId); // Make sure the clean happens before sending the list.
				} else {
					if (!farmlists_to_send[village_id]) {
						farmlists_to_send[village_id] = [];
					}
					farmlists_to_send[village_id].push(list_obj.listId); // No cleaning was desired so just add the list.
				}
			}
			for (var village_id in farmlists_to_send) {
				if (farmlists_to_send.hasOwnProperty(village_id)) {
					var farmlist_ids = farmlists_to_send[village_id];
					const village_id_num: number = parseInt(village_id);
					await api.send_farmlists(farmlist_ids, village_id_num);
					await sleep(get_random_int(.75, 1.25));
				}
			}
			log('farmlists sent');

			await sleep(get_random_int(interval_min, interval_max));
		}

		log(`farming uuid: ${this.options.uuid} stopped`);
		this.running = false;
		this.options.run = false;
	}
}

export default new send_farmlist();