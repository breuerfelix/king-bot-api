import express from 'express';
import path from 'path';
import kingbot from './index';
import api from './api';
import settings from './settings';
import logger from './logger';
import { inactive_finder } from './extras';
import { buildings, tribe, troops } from './data';
import { Ifeature_params, feature } from './features/feature';
import { Ivillage, Ibuilding, Iplayer } from './interfaces';
import { find_state_data } from './util';
import {
	raise_fields, building_queue,
	finish_earlier, auto_adventure, send_farmlist,
	trade_route, timed_attack
} from './features';
import { farming, village, player } from './gamedata';

class server {
	app: any = null;

	features: feature[] = [
		finish_earlier,
		auto_adventure,
		send_farmlist,
		building_queue,
		raise_fields,
		trade_route,
		timed_attack
	];

	constructor() {
		this.app = express();

		this.app.use(express.json());

		this.app.use(express.static(path.resolve(__dirname, '../public')));

		this.app.get('/api/allfeatures', (req: any, res: any) => {
			let response: Ifeature_params[] = [];

			for (let feat of this.features) response = [...response, ...feat.get_feature_params()];

			res.send(response);
		});

		this.app.post('/api/feature', (req: any, res: any) => {
			const { feature } = req.body;
			const ident = feature.ident;

			let response: string = '';

			for (let feat of this.features) {
				if (feat.get_ident() == ident) {
					response = feat.handle_request(req.body);
					break;
				}
			}

			res.send(response);
		});

		this.app.get('/api/data', async (req: any, res: any) => {
			const { ident } = req.query;

			if (ident == 'villages') {
				const villages = await village.get_own();
				const data = find_state_data(village.own_villages_ident, villages);

				res.send(data);
				return;
			}

			if (ident == 'farmlists') {
				const farmlists = await farming.get_own();
				const data = find_state_data(farming.farmlist_ident, farmlists);

				res.send(data);
				return;
			}
			if (ident == 'player_tribe') {
				const player_data: Iplayer = await player.get();
				const data: tribe = player_data.tribeId;

				res.send(data);
				return;
			}

			if (ident == 'buildings') {
				const { village_id } = req.query;

				const queue_ident: string = village.building_collection_ident + village_id;

				const response: any[] = await api.get_cache([queue_ident]);

				const rv = [];
				const data = find_state_data(queue_ident, response);

				for (let bd of data) {
					const build: Ibuilding = bd.data;

					if (Number(build.buildingType) != 0)
						if (Number(build.lvl) > 0)
							rv.push(build);
				}

				res.send(rv);

				return;
			}

			if (ident == 'village') {
				const { village_id } = req.query;
				const village_data = await village.get_own();
				const village_obj: Ivillage = village.find(village_id, village_data);

				res.send(village_obj);

				return;
			}

			if (ident == 'buildingdata') {
				res.send(buildings);
				return;
			}

			if (ident == 'troops') {
				res.send(troops);
				return;
			}

			if (ident == 'settings') {
				res.send({
					email: settings.email,
					gameworld: settings.gameworld
				});

				return;
			}

			if (ident == 'logger') {
				// send latest 100 logs to frontend
				res.send(logger.log_list.slice(-100));
				return;
			}

			res.send('error');
		});


		this.app.post('/api/findvillage', async (req: any, res: any) => {
			const response = await api.get_cache(req.body);
			res.send(response);
		});

		this.app.post('/api/checkTarget', async (req: any, res: any) => {
			const response = await api.check_target(req.body.sourceVillage, req.body.destinationVillage, 4);
			res.send(response);
		});

		this.app.post('/api/easyscout', (req: any, res: any) => {
			const { village_id, list_name, amount, mission } = req.body;

			kingbot.scout(list_name, village_id, amount, mission);

			res.send('success');
		});

		this.app.post('/api/login', async (req: any, res: any) => {
			const { gameworld, email, password, ingameName } = req.body;

			settings.write_credentials(gameworld, email, password, ingameName);
			process.exit();

			res.send('this wont be send anyways...');
		});

		this.app.post('/api/inactivefinder', async (req: any, res: any) => {
			const { action, data } = req.body;

			if (action == 'get') {
				const {
					min_player_pop,
					max_player_pop,
					min_village_pop,
					max_village_pop,
					village_name,
					village_id,
					inactive_for,
					min_distance,
					max_distance
				} = data;

				const response = await inactive_finder.get_new_farms(
					min_player_pop, max_player_pop,
					min_village_pop, max_village_pop,
					village_name, village_id, inactive_for,
					min_distance, max_distance
				);

				res.send(response);
				return;
			}

			if (action == 'toggle') {
				const { farmlist, village } = data;
				const response = await inactive_finder.add_inactive_player(farmlist, village);

				res.send(response);
				return;
			}

			res.send({
				error: true,
				message: 'could not identify action',
				data: []
			});
		});

		// handles all 404 requests to main page
		this.app.get('*', (req: any, res: any) => {
			res.sendFile(path.resolve(__dirname, '../public', 'index.html'));
		});
	}

	async start(port: number) {
		this.app.listen(port, () => logger.info(`server running on => http://localhost:${port}`));

		// start all features on startup
		for (let feat of this.features) feat.start_for_server();
	}

}

export default new server();
