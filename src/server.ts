import express from 'express';
import path from 'path';
import kingbot from './index';
import api from './api';
import settings from './settings';
import { Ifeature_params } from './features/feature';
import { Ivillage, Ibuilding } from './interfaces';
import { find_state_data } from './util';
import { building_queue, finish_earlier, auto_adventure, send_farmlist } from './features';
import { farming, village } from './gamedata';

class server {
	app: any = null;

	constructor() {
		this.app = express();

		this.app.use(express.json());

		this.app.use(express.static(path.resolve(__dirname, '../build')));

		this.app.get('/api/allfeatures', (req: any, res: any) => {
			const response: Ifeature_params[] = [
				auto_adventure.get_feature_params(),
				finish_earlier.get_feature_params(),
				...send_farmlist.get_feature_params(),
				...building_queue.get_feature_params()
			];

			res.send(response);
		});

		this.app.post('/api/feature', (req: any, res: any) => {
			const { feature } = req.body;
			const ident = feature.ident;

			let response: string = '';

			if(ident == 'hero') {
				response = auto_adventure.handle_request(req.body);
			} else if (ident == 'farming') {
				response = send_farmlist.handle_request(req.body);
			} else if (ident == 'finish_earlier') {
				response = finish_earlier.handle_request(req.body);
			} else if (ident == 'queue') {
				response = building_queue.handle_request(req.body);
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

			if(ident == 'queue') {
				const { village_name } = req.query;
				const village_data = await village.get_own();
				const village_obj: Ivillage = village.find(village_name, village_data);

				const queue_ident: string = village.building_collection_ident + village_obj.villageId;

				const response: any[] = await api.get_cache([ queue_ident]);

				const rv = [];
				const data = find_state_data(queue_ident, response);

				for(let bd of data) {
					const build: Ibuilding = bd.data;
					
					if(Number(build.buildingType) != 0) rv.push(build);
				}

				res.send(rv);

				return;
			}

			if(ident == 'buildings') {
				res.send(settings.get_buildings());
				return;
			}

			res.send('error');
		});

		this.app.post('/api/easyscout', (req: any, res: any) => {
			const { village_name, list_name } = req.body;

			kingbot.scout(list_name, village_name);

			res.send('success');
		});
	}

	async start(port: number) {
		this.app.listen(port, () => console.log(`server running on port ${port}!`));
	}

}

export default new server();
