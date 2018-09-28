import axios, { AxiosInstance } from 'axios';
import login_to_gameworld from './login';
import settings from './settings';

class api {
	ax: AxiosInstance;

	// set default so dev server can replace later
	session: string = 'insert_session';
	token: string = 'insert_token';
	msid: string = 'insert_msid';

	constructor() {
		this.ax = axios.create();
		this.ax.defaults.withCredentials = true;

		//set base url to localhost if in dev mode
		if(settings.dev_mode) this.ax.defaults.baseURL = 'http://localhost:3030/api';
	}

	async login(email: string, password: string, gameworld: string) {
		let rv = await login_to_gameworld(this.ax, email, password, gameworld);

		// assign login credentials
		this.session = rv.session;
		this.token = rv.token;
		this.msid = rv.msid;

		// set base url
		this.ax.defaults.baseURL = `https://${gameworld.toLowerCase()}.kingdoms.com/api`;
	}

	async get_all() {
		let session: string = this.session;

		const payload = {
			controller: 'player',
			action: 'getAll',
			params: {},
			session
		};

		let response = await this.ax.post(`/?c=player&a=getAll&t${Date.now()}`, payload);
		console.log(response.data);
	}

	// for dev server
	async post(url: string, payload: object) {
		return await this.ax.post(url, payload);
	}

	// for dev server
	async get(url: string) {
		return await this.ax.get(url);
	}
}

export default new api();
