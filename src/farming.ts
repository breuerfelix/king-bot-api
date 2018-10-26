import { log, find_state_data, sleep, list_remove } from './util';
import { Ifarmlist, Ivillage, Ifeature, Irequest } from './interfaces';
import village from './village';
import api from './api';
import database from './database';
import uniqid from 'uniqid';

interface Ifeature_farming extends Ifeature, options {}

interface Irequest_farming extends Irequest {
	feature: Ifeature_farming
}

interface options {
	uuid: string
	farmlists: string[]
	village_name: string
	interval: number
	run: boolean
	error: boolean
}

class farming {
	farmlist_ident: string = 'Collection:FarmList:';
	static farmlist_ident: string = 'Collection:FarmList:';

	farming_features: farm_feature[] = []
	
	find(name: string, data: any): Ifarmlist {
		return farming.find(name, data);
	}

	static find(name: string, data: any): Ifarmlist {
		const lists = find_state_data(farming.farmlist_ident, data);

		const farmlist = lists.find((x: any) => x.data.listName.toLowerCase() == name.toLowerCase());

		if(!farmlist) {
			log(`couldn't find farmlist ${name} !`);
			return null;
		}

		return farmlist.data;
	}

	async get_own(): Promise<any> {
		return await api.get_cache([ this.farmlist_ident ]);
	}

	constructor() {
		// load in data from database
		const options: options[] = database.get('farming.options').value();

		if(!options) return;

		for(let opt of options) {
			this.farming_features.push(new farm_feature(opt));
		}
	}

	get_feature_params(): Ifeature_farming[] {
		const rv: Ifeature_farming[] = [];
		for(let feat of this.farming_features) rv.push(feat.get_feature_params());
		return rv;
	}

	handle_request(payload: Irequest_farming): any {
		const { action } = payload;

		if(action == 'new') {
			const uuid: string = uniqid.time();

			const options: options = {
				uuid,
				farmlists: [],
				village_name: '',
				interval: 0,
				run: false,
				error: false
			};

			let feat = new farm_feature(options);
			this.farming_features.push(feat);

			this.save();
			
			return feat.get_feature_params();
		}

		const { uuid } = payload.feature;
		const feature: farm_feature = this.farming_features.find(x => x.options.uuid == uuid);

		if(!feature) return 'error';

		if(action == 'start') {
			feature.options.run = true;
			if(!feature.running) feature.start();
			this.save();
			return 'online';
		}

		if(action == 'stop') {
			feature.stop();
			this.save();
			return 'offline';
		}

		if(action == 'update') {
			feature.stop();
			list_remove(feature, this.farming_features);

			const { farmlists, village_name, interval } = payload.feature;
			const new_opt: options = {
				uuid: feature.options.uuid,
				run: feature.options.run,
				farmlists,
				village_name,
				interval,
				error: false
			};

			const new_feat: farm_feature = new farm_feature(new_opt);

			this.farming_features.push(new_feat);
			this.save();

			return 'success';
		}

		if(action == 'delete') {
			feature.stop();
			list_remove(feature, this.farming_features);
			this.save();
			
			return 'success';
		}

		return 'error';
	}

	save(): void {
		const rv: options[] = [];

		for(let feat of this.farming_features) rv.push(feat.options);

		database.set('farming.options', rv).write();
	}

	// starts farming when server starts
	start_farms(): void {
		for(let farm of this.farming_features) {
			if(farm.options.run)
				farm.start();
		}
	}

	// command line start
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
			run: true,
			error: false
		};

		let feat = new farm_feature(options);
		this.farming_features.push(feat);
		feat.start();
	}
}

class farm_feature {
	running: boolean = false;
	options: options = null;

	constructor(options: options) {
		this.options = options;
	}

	get_feature_params(): Ifeature_farming {
		const { village_name, interval } = this.options;

		const params = {
			ident: 'farming',
			name: (this.options.farmlists.length < 1) ? 'farming' : 'farmlist ' + this.options.farmlists[0],
			description: `${village_name} / ${interval} s`,
			...this.options
		};

		return params;
	}

	stop(): void {
		this.options.run = false;
	}

	async start(): Promise<void> {
		try {
			this.running = true;
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
		} catch {
			log(`error on farming uuid: ${this.options.uuid}`);
			this.options.run = false;
			this.options.error = true;
			this.running = false;
		}
	}
}

export default new farming();
