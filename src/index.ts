import api from './api';
import settings from './settings';
import { log, sleep } from './util';
import { Ivillage, Ifarmlist, Iunits, Iplayer } from './interfaces';
import building_queue, { Iresource_type } from './building';
import { tribe } from './data';
import server from './server';
import { send_farmlist, auto_adventure, finish_earlier, adventure_type } from './features';
import { farming, village, player } from './gamedata';

class kingbot {
	async start_server(gameworld: string = '', email: string = '', password: string = '', port: number = 3000) {
		await this.login(gameworld, email, password);

		server.start(port);

		// start all running features
		auto_adventure.start_for_server();
		send_farmlist.start_for_server();
		finish_earlier.start_for_server();
	}

	async login(gameworld: string, email: string = '', password: string = ''): Promise<void> {
		if(!email || !password || !gameworld) {
			let cred: any = settings.read_credentials();

			if(cred) {
				email = cred.email;
				password = cred.password;
				gameworld = cred.gameworld;
			}
		}

		if(!email || !password || !gameworld) {
			log('please provide email, password and gameworld');
			process.exit();
			return;
		}

		console.log(`start login to gameworld ${gameworld} with account ${email} ...`);
		await api.login(email, password, gameworld);
	}

	start_farming(farmlists: string[], village_name: string | string[], interval: number): void {
		send_farmlist.start_farming(farmlists, village_name, interval);
	}

	add_building_queue(resources: Iresource_type, village_name: string): void {
		building_queue.upgrade_res(resources, village_name);
	}

	finish_earlier(): void {
		building_queue.upgrade_earlier();
	}

	auto_adventure(type: adventure_type = adventure_type.short, min_health: number = 15): void {
		auto_adventure.auto_adventure(type, min_health);
	}

	async scout(farmlist_name: string, village_name: string, amount: number = 1) {
		const params = [
			village.own_villages_ident,
			farming.farmlist_ident
		];

		// fetch data
		const response = await api.get_cache(params);

		const vill: Ivillage = village.find(village_name, response);
		if(!vill) return;

		const village_id: number = vill.villageId;

		const list_obj = farming.find(farmlist_name, response);
		if(!list_obj) return;

		const list_id: number = list_obj.listId;

		if(!list_id) return;

		const player_data: Iplayer = await player.get();
		const own_tribe: tribe = player_data.tribeId;

		const units: Iunits = {
			1: 0,
			2: 0,
			3: 0,
			4: 0,
			5: 0,
			6: 0,
			7: 0,
			8: 0,
			9: 0,
			10: 0,
			11: 0
		};

		// scouts are on different positions
		if(own_tribe == tribe.gaul) units[3] = amount;
		else units[4] = amount;

		// send scouts
		for(let target of list_obj.villageIds) {
			await api.send_units(village_id, target, units, 6);
		}
	}
}

export default new kingbot();
