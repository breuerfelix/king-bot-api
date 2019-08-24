import api from './api';
import settings from './settings';
import { log, sleep } from './util';
import { Ivillage, Ifarmlist, Iunits, Iplayer } from './interfaces';
import { tribe } from './data';
import server from './server';

import { farming, village, player } from './gamedata';

class kingbot {
	async start_server(
		gameworld: string = '',
		email: string = '',
		password: string = '',
		sitter_type: string = '',
		sitter_name: string = '',
		port: number = 3000
	) {
		await settings.init();
		await this.login(gameworld, email, password, sitter_type, sitter_name);

		server.start(port);
	}

	async login(
		gameworld: string,
		email: string = '',
		password: string = '',
		sitter_type: string = '',
		sitter_name: string = ''
	): Promise<void> {

		if (!email || !password || !gameworld) {
			let cred: any = settings.read_credentials();

			if (cred) {
				email = cred.email;
				password = cred.password;
				gameworld = cred.gameworld;
				sitter_name = cred.sitter_name;
				sitter_type = cred.sitter_type;
			}
		}

		if (!email || !password || !gameworld) {
			log('please provide email, password and gameworld');
			process.exit();
			return;
		}

		//console.log(`start login to gameworld ${gameworld} with account ${email} ...`);
		log('start login...');
		await api.login(email, password, gameworld, sitter_type, sitter_name);
	}

	async scout(farmlist_name: string, village_id: number, amount: number = 1, mission: string = 'resources') {
		const params = [
			village.own_villages_ident,
			farming.farmlist_ident
		];

		// fetch data
		const response = await api.get_cache(params);

		const list_obj = farming.find(farmlist_name, response);
		if (!list_obj) return;

		const list_id: number = list_obj.listId;

		if (!list_id) return;

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
		if (own_tribe == tribe.gaul) units[3] = amount;
		else units[4] = amount;

		// send scouts
		for (let target of list_obj.villageIds) {
			await api.send_units(village_id, target, units, 6, mission);
		}
	}
}

export default new kingbot();
