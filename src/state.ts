import merge from 'deepmerge';
import api from './api';
import { log } from './util';

class state {

	// global state object
	public state: any[] = [];
	
	// identifiers
	farmlist_ident: string = 'Collection:FarmList:';
	village_ident: string = 'Collection:Village:'

	set_state(new_state: any): void {
		this.state = merge(this.state, new_state);
	}

	find(ident: string, contains: boolean = false): any {
		const found_obj = this.state.find(x => {
			return contains ? x.name.includes(ident) : x.name === ident;
		});

		return found_obj.data;
	}

	async refetch_all(): Promise<void> {
		await api.get_cache([ this.farmlist_ident ]);
	}

	get_farmlist(name: string): any {
		const lists = this.find(this.farmlist_ident);

		const farmlist = lists.find((x: any) => x.data.listName.toLowerCase() === name.toLowerCase());

		if(!farmlist) {
			log(`couldn't find farmlist ${name} !`);
			return null;
		}

		return farmlist.data;
	}

	get_village(name: string): any {
		const villages = this.find(this.village_ident + 'own');

		const village = villages.find((x: any) => x.data.name.toLowerCase() === name.toLowerCase());

		if(!village) {
			log(`couldn't find village ${name} !`);
			return null;
		}

		return village.data;
	}
}

export default new state();
