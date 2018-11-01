import { log, find_state_data, sleep, list_remove } from '../util';
import { Ifarmlist, Ivillage } from '../interfaces';
import { Ifeature, Irequest, feature_collection, feature_item, Ioptions } from './feature';
import { farming, village } from '../gamedata';
import api from '../api';
import database from '../database';
import uniqid from 'uniqid';

interface Ioptions_farm extends Ioptions {
	farmlists: string[]
	village_name: string
	interval: number
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
			village_name: '',
			interval: 0
		};
	}

	// command line start
	start_farming(farmlists: string[], village_name: string | string[], interval: number): Promise<void> {
		if(Array.isArray(village_name)) {
			for(let name of village_name) this.start_farming(farmlists, name, interval);
			return;
		}

		const uuid: string = uniqid.time();

		const options: Ioptions_farm = {
			uuid,
			farmlists,
			village_name,
			interval,
			run: true,
			error: false
		};

		let feat = new farm_feature(options);
		this.features.push(feat);
		feat.start();
	}
}

class farm_feature extends feature_item {
	options: Ioptions_farm;

	set_options(options: Ioptions_farm): void {
		const { uuid, run, error, farmlists, village_name, interval } = options;
		this.options = {
			...this.options,
			uuid,
			run,
			error,
			farmlists,
			village_name,
			interval
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
		const { village_name, interval } = this.options;
		return `${village_name} / ${interval} s`;
	}

	get_long_description(): string {
		return 'this feature will just send the farmlist in a given interval.';
	}

	async run(): Promise<void> {
		log(`farming uuid: ${this.options.uuid} started`);

		const { village_name, farmlists, interval } = this.options;
		const params = [
			village.own_villages_ident,
			farming.farmlist_ident
		];

		// fetch farmlists
		const response = await api.get_cache(params);

		const vill: Ivillage = village.find(village_name, response);
		if(!vill) {
			this.running = false;
			return;
		}

		const village_id: number = vill.villageId;
		const farmlist_ids: number[] = [];

		for(let list of farmlists) {
			const list_obj = farming.find(list, response);
			if(!list_obj) {
				this.running = false;
				return;
			}

			const list_id: number = list_obj.listId;
			farmlist_ids.push(list_id);
		}

		if(!farmlist_ids) {
			this.running = false;
			return;
		}

		while(this.options.run) {
			await api.send_farmlists(farmlist_ids, village_id);
			log(`farmlists ${farmlists} sent from village ${village_name}`);

			await sleep(interval);
		}

		log(`farming uuid: ${this.options.uuid} stopped`);
		this.running = false;
		this.options.run = false;
	}
}

export default new send_farmlist();
