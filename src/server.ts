import express from 'express';
import path from 'path';
import kingbot from './index';
import api from './api';
import settings from './settings';
import { inactive_finder } from './extras';
import { buildings } from './data';
import { Ifeature_params, feature } from './features/feature';
import { Ivillage, Ibuilding } from './interfaces';
import { find_state_data } from './util';
import { raise_fields, building_queue, finish_earlier, auto_adventure, send_farmlist, trade_route, basic_farmlist } from './features';
import { farming, village } from './gamedata';

class server {
	app: any = null;

	features: feature[] = [
		finish_earlier,
		auto_adventure,
		send_farmlist,
		building_queue,
		raise_fields,
		trade_route,
		basic_farmlist
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

			if (ident == 'buildings') {
				const { village_name } = req.query;
				const village_data = await village.get_own();
				const village_obj: Ivillage = village.find(village_name, village_data);

				const queue_ident: string = village.building_collection_ident + village_obj.villageId;

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

			if (ident == 'buildingdata') {
				res.send(buildings);
				return;
			}

			if (ident == 'settings') {
				res.send({
					email: settings.email,
					gameworld: settings.gameworld
				});

				return;
			}

			res.send('error');
		});

		this.app.post('/api/easyscout', (req: any, res: any) => {
			const { village_name, list_name, amount, mission } = req.body;

			kingbot.scout(list_name, village_name, amount, mission);

			res.send('success');
		});

		this.app.post('/api/findVillage', async (req: any, res: any) => {
			const response = await api.get_cache(req.body);
			res.send(response)
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
					inactive_for,
					min_distance,
					max_distance
				} = data;

				const response = await inactive_finder.get_new_farms(
					min_player_pop, max_player_pop,
					min_village_pop, max_village_pop,
					village_name, inactive_for,
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
			//res.redirect('/');
			res.sendFile(path.resolve(__dirname, '../public', 'index.html'));
		});
	}

	async start(port: number) {
		this.app.listen(port, () => console.log(`server running on port ${port}!`));

		// start all features on startup
		for (let feat of this.features) feat.start_for_server();
	}

}

export default new server();
