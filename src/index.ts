import api from './api';
import settings from './settings';
import { log, sleep } from './util';
import { Ivillage, Ifarmlist } from './interfaces';
import building_queue, { Iresource_type } from './building';
import farming from './farming';
import village from './village';

class kingbot {
	async login(gameworld: string, email: string = '', password: string = ''): Promise<void> {
		if(!gameworld) {
			log('no gameworld provided');
			process.exit();
			return;
		}

		if(!email || !password) {
			let cred: any = settings.read_credentials();

			if(cred) {
				email = cred.email;
				password = cred.password;
			}
		}
		
		if(!email || !password) {
			log('please provide email and password');
			process.exit();
			return;
		}
		
		console.log(`start login to gameworld ${gameworld} with account ${email} ...`);
		await api.login(email, password, gameworld);
	}

	async start_farming(farmlists: string[], village_name: string | string[], interval: number): Promise<void> {
		if(Array.isArray(village_name)) {
			for(let name of village_name) this.start_farming(farmlists, name, interval);
			return;
		}

		const params = [
			village.own_villages_ident,
			farming.farmlist_ident
		];

		// fetch farmlists
		const response = await api.get_cache(params);

		const vill: Ivillage | null = village.find(village_name, response);
		if(!vill) return;

		const village_id: number = vill.villageId;
		const farmlist_ids: number[] = [];

		for(let list of farmlists) {
			const list_obj = farming.find(list, response);
			if(!list_obj) return;

			const list_id: number = list_obj.listId;
			farmlist_ids.push(list_id);
		}

		if(!farmlist_ids) return;

		while(true) {
			await api.send_farmlists(farmlist_ids, village_id);
			log(`farmlists ${farmlists} sent from village ${village_name}`);

			await sleep(interval);
		}
	}

	add_building_queue(resources: Iresource_type, village: string): void {
		building_queue.upgrade_res(resources, village);
	}

	finish_earlier(): void {
		building_queue.upgrade_earlier();
	}
}

export default new kingbot();
