import { log, find_state_data, sleep, list_remove, get_random_int } from '../util';
import { Ifarmlist, Ivillage } from '../interfaces';
import { Ifeature, Irequest, feature_collection, feature_item, Ioptions } from './feature';
import { farming, village } from '../gamedata';
import api from '../api';
import database from '../database';
import uniqid from 'uniqid';
import timed_attack from './timed_attack';

interface Ioptions_farm extends Ioptions {
	farmlists: string[]
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
			losses_farmlist: '',
			interval_min: 0,
			interval_max: 0,
		};
	}
}

class farm_feature extends feature_item {
	options: Ioptions_farm;

	set_options(options: Ioptions_farm): void {
		const { uuid, run, error, farmlists, interval_min, interval_max, losses_farmlist } = options;
		this.options = {
			...this.options,
			uuid,
			run,
			error,
			farmlists,
			interval_min,
			interval_max,
			losses_farmlist,
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
		return `Farming: ${interval_min} - ${interval_max} s`;
	}

	get_long_description(): string {
		return 'this feature will just send the farmlist in a given interval.';
	}

	async run(): Promise<void> {
		log(`farming uuid: ${this.options.uuid} started`);

		const { farmlists, interval_min, interval_max, losses_farmlist } = this.options;
		var params = [
			village.own_villages_ident,
			farming.farmlist_ident
		];

		// fetch farmlists
		const response = await api.get_cache(params);

		async function asyncForEach(array: any, callback: any) {
			for (let index = 0; index < array.length; index++) {
				await callback(array[index], index, array);
			}
		}

		const losses_list_obj = farming.find(losses_farmlist, response);
		const losses_id = losses_list_obj.listId;
		while (this.options.run) {


			asyncForEach(farmlists, async (farm: any) => {
				sendFarmlist(farm);
				await sleep(.25);
			});

			async function sendFarmlist(entry: any) {
				const vill: Ivillage = village.find(entry.village_name, response);
				const village_id: number = vill.villageId;
				var farmlist_id: number = NaN;

				const list_obj = farming.find(entry.farmlist, response);


				const lastSent: number = list_obj.lastSent
				const now: number = new Date().getTime() / 1000;

				if ((now - lastSent) > interval_min) {
					farmlist_id = list_obj.listId;

					params = []
					params = [`Collection:FarmListEntry:${farmlist_id}`]
					var listResponse = await api.get_cache(params);
					if (listResponse.length > 0) {
						listResponse[0].data.forEach(async (data: any) => {
							const farm = data.data;
							if (farm.lastReport) {
								if (farm.lastReport.notificationType != '1') {
									console.log("removing")
									await api.copy_farmlist_entry(farm.villageId, losses_id, farm.entryId);
									await sleep(.15);
									await api.copy_farmlist_entry(farm.villageId, farmlist_id, farm.entryId);
								}
							} else {
								console.log(farm)
								await api.copy_farmlist_entry(farm.villageId, losses_id, farm.entryId);
								await sleep(.15);
								await api.copy_farmlist_entry(farm.villageId, farmlist_id, farm.entryId);
							}
						});
						await sleep(3.15);
						const farmlist_ids: number[] = [farmlist_id]
						await api.send_farmlists(farmlist_ids, village_id);
						log(`farmlist: ${entry.farmlist} sent from village ${entry.village_name}`);
					} else {


						log(`farmlist: ${entry.farmlist} skipped. List was empty?`);
					}
				} else {
					log(`farmlist: ${entry.farmlist} sent too recently. skipping until next time`)
				}
			};


			await sleep(get_random_int(interval_min, interval_max));
		}

		log(`farming uuid: ${this.options.uuid} stopped`);
		this.running = false;
		this.options.run = false;
	}
}

export default new send_farmlist();
