import axios, { AxiosInstance } from 'axios';
import { clash_obj, get_date } from './util';
import manage_login from './login';
import settings from './settings';
import database from './database';
import { Iunits } from './interfaces';

class api {
	private ax: AxiosInstance;

	session: string = '';
	token: string = '';
	msid: string = '';

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

	async get_all(): Promise<any[]> {
		return await this.post('getAll', 'player', {});
	}

	async get_cache(params: string[]): Promise<any[]> {
		const session: string = this.session;

		const payload = {
			controller: 'cache',
			action: 'get',
			params: {
				names: params
			},
			session
		};

		const response = await this.ax.post(`/?c=cache&a=get&t${get_date()}`, payload);

		return this.merge_data(response.data);
	}

	async send_farmlists(lists: number[], village_id: number): Promise<object> {
		const params = {
			listIds: lists,
			villageId: village_id
		};

		return await this.post('startFarmListRaid', 'troops', params);
	}

	async upgrade_building(buildingType: number, locationId: number, villageId: number): Promise<void> {
		const params = {
			villageId,
			locationId,
			buildingType
		};

		return await this.post('upgrade', 'building', params);
	}

	async finish_now(villageId: number, queueType: number): Promise<any> {
		const params = {
			featureName: 'finishNow',
			params: {
				villageId,
				queueType,
				price: 0
			}
		};

		return await this.post('bookFeature', 'premiumFeature', params);

	}

	async send_units(villageId: number, destVillageId: number, units: Iunits, movementType: number, spyMission: string = 'resources'): Promise<any> {
		const params = {
			destVillageId,
			villageId,
			movementType,
			redeployHero: false,
			units,
			spyMission
		};

		return await this.post('send', 'troops', params);
	}

	async start_adventure(type: number): Promise<void> {
		const params = {
			questId: (type == 0) ? 991 : 992,
			dialogId: 0,
			command: 'activate'
		};

		return await this.post('dialogAction', 'quest', params);
	}

	async post(action: string, controller: string, params: object): Promise<any> {
		const session = this.session;

		const payload = {
			controller,
			action,
			params,
			session
		};

		const response: any = await this.ax.post(`/?t${get_date()}`, payload);

		if(response.errors) {
			console.log(response.errors);
		}

		return this.merge_data(response.data);
	}

	// merges data into state object
	merge_data: any = (data: any) => clash_obj(data, 'cache', 'response');
}

export default new api();
