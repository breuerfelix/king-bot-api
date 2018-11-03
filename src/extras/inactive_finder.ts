import axios from 'axios';
import settings from '../settings';
import api from '../api';
import { farming, village } from '../gamedata';
import { find_state_data } from '../util';
import { Ifarmlist, Ivillage } from '../interfaces';
import { Iresponse } from '../features/feature';

class inactive_finder {
	url: string = 'http://travian.scriptworld.net/inactive';

	async add_inactive_player(farmlist: string, inactive: any): Promise<Iresponse> {
		const temp_data: any = await farming.get_own();
		const farmlist_data: Ifarmlist = farming.find(farmlist, temp_data);

		if(!farmlist_data) {
			return {
				error: true,
				message: 'could not find given farmlist',
				data: null
			};
		}

		await api.toggle_farmlist_entry(inactive.villageId, farmlist_data.listId);

		return {
			error: false,
			message: 'toggled farmlist',
			data: null
		};
	}

	async get_new_farms(
		max_player_pop: string,
		max_village_pop: string,
		village_name: string,
		inactive_for: string,
		max_distance: string
	): Promise<any> {

		let gameworld: string = settings.gameworld;

		const village_data = await village.get_own();
		const found_village: Ivillage = village.find(village_name, village_data);
		
		if(!found_village) {
			return {
				error: true,
				message: `village: ${ village_name } not found.`,
				data: null
			};
		}

		const { x, y } = found_village.coordinates;

		const query: string = `/?gameworld=${gameworld}&
			max_player_pop=${max_player_pop}&
			max_village_pop=${max_village_pop}&
			inactive_for=${inactive_for}&
			max_distance=${max_distance}&
			x=${x}&
			y=${y}
		`.replace(/\s/g, '');

		const res: any = await axios.get(this.url + query);
		if(res.data.error) {
			return res.data;
		}

		const farmlists = await farming.get_own();
		const data: any[] = find_state_data(farming.farmlist_ident, farmlists);

		const villages_farmlist: Array<number> = [];

		for(let farm of data) {
			const farm_data: Ifarmlist = farm.data;
			for(let id of farm_data.villageIds) {
				villages_farmlist.push(Number(id));
			}
		}

		const rv: any[] = [];

		for(let farm of res.data.data) {
			if(villages_farmlist.indexOf(Number(farm.villageId)) > -1) continue;

			rv.push(farm);
		}

		return {
			error: false,
			message: `${ res.data.data.length } found / ${ rv.length } displayed`,
			data: rv
		};
	}
}

export default new inactive_finder();
