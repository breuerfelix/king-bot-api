import axios, { AxiosInstance } from 'axios';
import { clash_obj } from './util';
import manage_login from './login';
import settings from './settings';
import state from './state';
import database from './database';

class api {
	private ax: AxiosInstance;

	// set default so dev server can replace later
	session: string = 'insert_session';
	token: string = 'insert_token';
	msid: string = 'insert_msid';

	constructor() {
		this.ax = axios.create();
		this.ax.defaults.withCredentials = true;
	}

	async login(email: string, password: string, gameworld: string) {
		await manage_login(this.ax, email, password, gameworld);

		// assign login credentials
		const { session_gameworld, token_gameworld, msid } = database.get('account').value();
		this.session = session_gameworld;
		this.token = token_gameworld;
		this.msid = msid;

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
}

export default new api();
