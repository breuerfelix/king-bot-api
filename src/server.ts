import express from 'express';
import { Ifeature_params } from './feature';
import hero from './hero';
import farming from './farming';
import path from 'path';
import village from './village';
import { find_state_data } from './util';
import kingbot from './index';
import finish_earlier from './finish_earlier';

class server {
	app: any = null;

	constructor() {
		this.app = express();

		this.app.use(express.json());

		this.app.use(express.static(path.resolve(__dirname, '../build')));

		this.app.get('/api/allfeatures', (req: any, res: any) => {
			const response: Ifeature_params[] = [
				hero.get_feature_params(),
				finish_earlier.get_feature_params(),
				...farming.get_feature_params()
			];

			res.send(response);
		});

		this.app.post('/api/feature', (req: any, res: any) => {
			const { feature } = req.body;
			const ident = feature.ident;

			let response: string = '';

			if(ident == 'hero') {
				response = hero.handle_request(req.body);
			} else if (ident == 'farming') {
				response = farming.handle_request(req.body);
			} else if (ident == 'finish_earlier') {
				response = finish_earlier.handle_request(req.body);
			}

			res.send(response);
		});
		
		this.app.get('/api/data/:ident', async (req: any, res: any) => {
			const { ident } = req.params;

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
