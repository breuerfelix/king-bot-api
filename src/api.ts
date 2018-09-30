import axios, { AxiosInstance } from 'axios';
import { clash_obj } from './util';
import login_to_gameworld from './login';
import settings from './settings';
import state from './state';

class api {
	private ax: AxiosInstance;

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

	async get_all(): Promise<object> {
		const session: string = this.session;

		const payload = {
			controller: 'player',
			action: 'getAll',
			params: {},
			session
		};

		const response = await this.ax.post(`/?c=player&a=getAll&t${Date.now()}`, payload);

		this.merge_data(response.data);

		return response.data;
	}

	async get_cache(params: string[]): Promise<object> {
		const session: string = this.session;
		
		const payload = {
			controller: 'cache',
			action: 'get',
			params: {
				names: params
			},
			session
		};

		const response = await this.ax.post(`/?c=cache&a=get&t${Date.now()}`, payload);

		this.merge_data(response.data);

		return response.data;
	}

	async send_farmlists(lists: string[], village_id: string): Promise<object> {
		const session: string = this.session;

		const payload = {
			action: 'startFarmListRaid',
			controller: 'troops',
			params: {
				listIds: lists,
				villageId: village_id
			},
			session
		};

		const response = await this.ax.post(`/?c=troops&a=startFarmListRaid&t${Date.now()}`, payload);

		this.merge_data(response.data);

		return response.data;
	}

	// merges data into state object
	merge_data(data: any): void {
		state.set_state(clash_obj(data, 'cache', 'response'));
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
