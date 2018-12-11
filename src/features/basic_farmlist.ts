import { log, find_state_data, sleep, list_remove, get_random_int } from '../util';
import { Ifarmlist, Ivillage } from '../interfaces';
import { Ifeature, Irequest, feature_collection, feature_item, Ioptions } from './feature';
import { farming, village } from '../gamedata';
import api from '../api';
import database from '../database';
import uniqid from 'uniqid';

interface Ioptions_farm extends Ioptions {
	village_name: string
	interval_min: number
	interval_max: number
}

class basic_farmlist extends feature_collection {
	get_ident(): string {
		return 'basic_farmlist';
	}

	get_new_item(options: Ioptions_farm): farm_feature {
		return new farm_feature({ ...options });
	}

	get_default_options(options: Ioptions): Ioptions_farm {
		return {
			...options,
			village_name: '',
			interval_min: 0,
			interval_max: 0
		};
	}
}

class farm_feature extends feature_item {
	options: Ioptions_farm;

	set_options(options: Ioptions_farm): void {
		const { uuid, run, error, village_name, interval_min, interval_max } = options;
		this.options = {
			...this.options,
			uuid,
			run,
			error,
			village_name,
			interval_min,
			interval_max
		};
	}

	get_options(): Ioptions_farm {
		return { ...this.options };
	}

	set_params(): void {
		this.params = {
			ident: 'basic_farmlist',
			name: ' basic farmlist'
		};
	}

	get_description(): string {
		const { village_name, interval_min, interval_max } = this.options;
		return `${village_name} / ${interval_min} - ${interval_max} s`;
	}

	get_long_description(): string {
		return 'this feature will just send the farmlist in a given interval.';
	}

	async run(): Promise<void> {

	}
}

export default new basic_farmlist();
