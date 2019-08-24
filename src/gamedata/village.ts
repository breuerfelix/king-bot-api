import { log, find_state_data } from '../util';
import { Ivillage } from '../interfaces';
import api from '../api';

class village {
	village_ident: string = 'Collection:Village:'
	own_villages_ident: string = this.village_ident + 'own';

	building_collection_ident: string = 'Collection:Building:';
	building_ident: string = 'Building:';
	building_queue_ident: string = 'BuildingQueue:';

	find(id: number, data: any): Ivillage {
		const villages = find_state_data(this.own_villages_ident, data);

		const village = villages.find((x: any) => x.data.villageId == id);

		if (!village) {
			log(`couldn't find village with ID: ${id} !`);
			return null;
		}

		return village.data;
	}

	async get_own(): Promise<any> {
		return await api.get_cache([this.own_villages_ident]);
	}
}

export default new village();
