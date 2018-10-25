import express from 'express';
import hero from './hero';
import farming from './farming';
import path from 'path';

class server {
	app: any = null;

	constructor() {
		this.app = express();

		this.app.use(express.json());

		this.app.use(express.static(path.resolve(__dirname, '../build')));

		this.app.get('/api/allfeatures', (req: any, res: any) => {
			res.send([
				hero.get_feature_params(),
				...farming.get_feature_params()
			]);
		});

		this.app.post('/api/feature', (req: any, res: any) => {
			const { feature } = req.body;
			const ident = feature.ident;

			let response: any = '';

			if(ident == 'hero') {
				response = hero.handle_request(req.body);
			} else if (ident == 'farming') {
				response = farming.handle_request(req.body);
			}

			res.send(response);
		});
	}

	async start(port: number) {
		this.app.listen(port, () => console.log(`server running on port ${port}!`));
	}

}

export default new server();
