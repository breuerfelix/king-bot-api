import express from 'express';
import path from 'path';
import kingbot from './index';
import api from './api';
import { buildings } from './data';
import { Ifeature_params, feature } from './features/feature';
import { Ivillage, Ibuilding } from './interfaces';
import { find_state_data } from './util';
import { building_queue, finish_earlier, auto_adventure, send_farmlist } from './features';
import { farming, village } from './gamedata';

class server {
	app: any = null;

	features: feature[] = [
		finish_earlier,
		auto_adventure,
		send_farmlist,
		building_queue
	];

	constructor() {
		this.app = express();

		this.app.use(express.json());

		this.app.use(express.static(path.resolve(__dirname, '../build')));

		this.app.get('/api/allfeatures', (req: any, res: any) => {
			let response: Ifeature_params[] = [];

			for(let feat of this.features) response = [ ...response, ...feat.get_feature_params() ];

			res.send(response);
		});

		this.app.post('/api/feature', (req: any, res: any) => {
			const { feature } = req.body;
			const ident = feature.ident;

			let response: string = '';

			for(let feat of this.features) {
				if(feat.get_ident() == ident) {
					response = feat.handle_request(req.body);
					break;
				}
			}

			res.send(response);
		});
		
		this.app.get('/api/data', async (req: any, res: any) => {
			const { ident } = req.query;

			if(ident == 'villages') {
				const villages = await village.get_own();
				const data = find_state_data(village.own_villages_ident, villages);

				res.send(data);
				return;
			}

			if(ident == 'farmlists') {
				const farmlists = await farming.get_own();
				const data = find_state_data(farming.farmlist_ident, farmlists);

				res.send(data);
				return;
			}

			if(ident == 'buildings') {
				const { village_name } = req.query;
				const village_data = await village.get_own();
				const village_obj: Ivillage = village.find(village_name, village_data);

				const queue_ident: string = village.building_collection_ident + village_obj.villageId;

				const response: any[] = await api.get_cache([ queue_ident]);

				const rv = [];
				const data = find_state_data(queue_ident, response);

				for(let bd of data) {
					const build: Ibuilding = bd.data;
					
					if(Number(build.buildingType) != 0) 
						if(Number(build.lvl) > 0)
							rv.push(build);
				}

				res.send(rv);

				return;
			}

			if(ident == 'buildingdata') {
				res.send(buildings);
				return;
			}

			res.send('error');
		});

		this.app.post('/api/easyscout', (req: any, res: any) => {
			const { village_name, list_name } = req.body;

			kingbot.scout(list_name, village_name);

			res.send('success');
		});

		// handles all 404 requests to main page
		this.app.get('*', (req: any, res: any) => {
			res.redirect('/');
		});
	}

	async start(port: number) {
		this.app.listen(port, () => console.log(`server running on port ${port}!`));

		// start all features on startup
		for(let feat of this.features) feat.start_for_server();
	}

}

export default new server();
