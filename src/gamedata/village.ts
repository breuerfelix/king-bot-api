import { log, find_state_data } from '../util';
import { Ivillage } from '../interfaces';
import api from '../api';

class village {
	village_ident: string = 'Collection:Village:'
	own_villages_ident: string = this.village_ident + 'own';

	find(name: string, data: any): Ivillage {
		const villages = find_state_data(this.own_villages_ident, data);

		const village = villages.find((x: any) => x.data.name.toLowerCase() == name.toLowerCase());

		if(!village) {
			log(`couldn't find village ${name} !`);
			return null;
		}

		return village.data;
	}

	async get_own(): Promise<any> {
		return await api.get_cache([this.own_villages_ident]);
	}
}

export default new village();
