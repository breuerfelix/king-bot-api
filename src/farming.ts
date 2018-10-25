import { log, find_state_data, sleep } from './util';
import { Ifarmlist, Ivillage } from './interfaces';
import village from './village';
import api from './api';
import database from './database';
import uniqid from 'uniqid';

class farming {
	farmlist_ident: string = 'Collection:FarmList:';
	static farmlist_ident: string = 'Collection:FarmList:';

	farming_features: farm_feature[] = []
	
	find(name: string, data: any): Ifarmlist {
		return farming.find(name, data);
	}

	static find(name: string, data: any): Ifarmlist {
		const lists = find_state_data(this.farmlist_ident, data);

		const farmlist = lists.find((x: any) => x.data.listName.toLowerCase() == name.toLowerCase());

		if(!farmlist) {
			log(`couldn't find farmlist ${name} !`);
			return null;
		}

		return farmlist.data;
	}

	constructor() {
		// load in data from database
		const options: any[] = database.get('farming.options').value();

		for(let opt of options) {
			this.farming_features.push(new farm_feature(opt));
		}
	}

	get_feature_params(): any [] {
		const rv: any[] = [];
		for(let feat of this.farming_features) rv.push(feat.get_feature_params());
		return rv;
	}

	handle_request(payload: any): any {
		// bei start, options.run auf true, falls running dann start sonst nicht start und save
		// bei stop options.run auf false und save
		// bei update feature stoppen und loeschen , neues feature anlegen

	}

	save() {
		// iterate over features and save options to array on farming.options

	}

	start_farms() {
		// starts farming when server starts
		for(let farm of this.farming_features) {
			if(farm.options.run)
				farm.start();
		}
	}

	start_farming(farmlists: string[], village_name: string | string[], interval: number): Promise<void> {
		if(Array.isArray(village_name)) {
			for(let name of village_name) this.start_farming(farmlists, name, interval);
			return;
		}

		const uuid: string = uniqid.time();

		const options: options = {
			uuid,
			farmlists,
			village_name,
			interval,
			run: true
		};

		let feat = new farm_feature(options);
		this.farming_features.push(feat);
		feat.start();

		this.save();
	}
}

class farm_feature {
	running: boolean = false;
	options: options = null;

	constructor(options: options) {
		this.options = options;
	}

	get_feature_params() {
		const params = {
			ident: 'farming',
			name: 'send farmlist',
			description: '',
			...this.options
		};

		return params;
	}

	async start() {
		this.running = true;
		log(`farming uuid: ${this.options.uuid} started`);

		const { village_name, farmlists, interval, run } = this.options;
		const params = [
			village.own_villages_ident,
			farming.farmlist_ident
		];

		// fetch farmlists
		const response = await api.get_cache(params);

		const vill: Ivillage | null = village.find(village_name, response);
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

		while(run) {
			await api.send_farmlists(farmlist_ids, village_id);
			log(`farmlists ${farmlists} sent from village ${village_name}`);

			await sleep(interval);
		}

		log(`farming uuid: ${this.options.uuid} stopped`);
		this.running = false;
	}
}

interface options {
	uuid: string
	farmlists: string[]
	village_name: string
	interval: number
	run: boolean
}

export default new farming();
