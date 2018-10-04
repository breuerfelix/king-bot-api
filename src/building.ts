import { Ivillage, Ibuilding, Ibuilding_queue } from './interfaces';
import state from './state';
import { log } from './util';
import { sleep } from './util';
import api from './api';

class building_queue {
	building_type: Iresource_type = {
		wood: 1,
		clay: 2,
		iron: 3,
		crop: 4
	}

	running: boolean = false;
	loop_data: { [index: number]: { [index: number]: number } } = {};

	building_ident: string = 'Collection:Building:';
	building_queue_ident: string = 'BuildingQueue:';


	upgrade_res(resources: Iresource_type, village_name: string): void {
		const village: Ivillage | null = state.get_village(village_name);

		if(!village) {
			log(`village ${village_name} could not be found`);
			return;
		}

		if(this.loop_data[village.villageId]) log('village already found, overwriting data');

		const data: { [index: number]: number } = {};

		for(let t in resources) {
			data[this.building_type[t]] = resources[t];
		}

		this.loop_data[village.villageId] = data;

		if(!this.running){
			this.running = true;
			this.run();
		}
	}
	
	async run(): Promise<void> {
		// sleep timer so the loop data gets filled up with all villages
		await sleep(3);
		
		while(true) {
			let params: string[] = [];

			for(let village in this.loop_data) {
				params.push(this.building_ident + village);
				params.push(this.building_queue_ident + village);
			}

			// fetch latest data needed
			await api.get_cache(params);

			for(let village in this.loop_data) {
				const queue_data: Ibuilding_queue = state.find(this.building_queue_ident + village);

				// skip if resource slot is used
				if(queue_data.freeSlots[2] == 0) continue;
				
				

				console.log('free' + village)
			}

			break;
		}
	}
}

export interface Iresource_type {
	[index: number]: number
	clay?: number
	iron?: number
	wood?: number
	crop?: number
}

export default new building_queue();

// list mit buildings
// wenn neues dazu kommt, adden
// bei jedem run einmal queue fetchen
// einach die queue pro building veraendern
//
// find village, storage = current resources
// free slots 1 und 2 sind frei heisst ich kann bauen !
//canuseinstantcontructiononlyinvillage = finish 5 min ealier
//
