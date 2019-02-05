import axios, { AxiosInstance } from 'axios';
import { clash_obj, get_date, log } from './util';
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
		this.ax.defaults.headers['User-Agent'] = 'Chrome/51.0.2704.63';
	}

	async login(email: string, password: string, gameworld: string, sitter_type: string, sitter_name: string) {
		await manage_login(this.ax, email, password, gameworld, sitter_type, sitter_name);

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

	// TODO better program this api call
	async get_report(sourceVillageId: number): Promise<any> {
		const params = {
			collection: 'search',
			start: 0,
			count: 1,
			filters: [
				'1', '2', '3',
				{ villageId: sourceVillageId }
			],
			'alsoGetTotalNumber': true
		};

		return await this.post('getLastReports', 'reports', params);
	}

	async send_partial_farmlists(listId: number, entryIds: number[], village_id: number): Promise<any> {
		const params = {
			listId: listId,
			entryIds: entryIds,
			villageId: village_id
		};

		return await this.post('startPartialFarmListRaid', 'troops', params);
	}

	async send_farmlists(lists: number[], village_id: number): Promise<any> {
		const params = {
			listIds: lists,
			villageId: village_id
		};

		return await this.post('startFarmListRaid', 'troops', params);
	}

	async toggle_farmlist_entry(villageId: number, listId: number): Promise<any> {
		const params = {
			villageId,
			listId
		};

		return await this.post('toggleEntry', 'farmList', params);
	}

	async copy_farmlist_entry(villageId: number, newListId: number, entryId: number): Promise<any> {
		const params = {
			villageId,
			newListId,
			entryId
		};

		return await this.post('copyEntry', 'farmList', params);
	}

	async upgrade_building(buildingType: number, locationId: number, villageId: number): Promise<any> {
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

	async check_target(villageId: number, destVillageId: number, movementType: number): Promise<any> {
		const params = {
			destVillageId,
			villageId,
			movementType
		};

		return await this.post('checkTarget', 'troops', params);
	}

	async send_units(
		villageId: number,
		destVillageId: number,
		units: Iunits,
		movementType: number,
		spyMission: string = 'resources'
		//catapultTargets = [] // TODO implement targets
	): Promise<any> {

		const params = {
			destVillageId,
			villageId,
			movementType,
			redeployHero: false,
			units,
			spyMission
			//catapultTargets = []  // TODO implement targets
		};

		return await this.post('send', 'troops', params);
	}


	async send_merchants(sourceVillageId: number, destVillageId: number, resources: number[]): Promise<any> {
		const params = {
			destVillageId,
			sourceVillageId,
			resources,
			recurrences: 1
		};

		return await this.post('sendResources', 'trade', params);
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

		if (response.errors) {
			log(response.errors);
		}

		return this.merge_data(response.data);
	}

	// merges data into state object
	merge_data: any = (data: any) => clash_obj(data, 'cache', 'response');
}

export default new api();
