import { feature_collection, feature_item, Ioptions, Ifeature } from './feature';
import settings from '../settings';

interface Ioptions_queue extends Ioptions {
	village_name: string
	queue: Iqueue[]
}

interface Iqueue {
	type: number
	location: number
	lvl: number
}

class building_queue extends feature_collection {
	get_database_ident(): string {
		return 'building_queue';
	}

	get_new_item(options: Ioptions_queue): queue {
		return new queue({ ...options });
	}

	get_default_options(options: Ioptions): Ioptions_queue {
		return {
			...options,
			village_name: '',
			queue: []
		};
	}
}

class queue extends feature_item {
	options: Ioptions_queue;

	set_options(options: Ioptions_queue): void {
		const { uuid, run, error, village_name, queue } = options;
		this.options = {
			...this.options,
			uuid,
			run,
			error,
			village_name,
			queue: [ ...queue ]
		};
	}

	get_options(): Ioptions_queue {
		return { ...this.options };
	}

	set_params(): void {
		this.params = { 
			ident: 'queue',
			name: 'building queue'
		};
	}

	get_description(): string {
		const { queue } = this.options;
		try {
			if(queue.length > 0) return 'next: ' + settings.get_buildings()[queue[0].type];
		} catch {
			return 'next: -';
		}

		return 'next: -';
	}

	async run(): Promise<void> {
		console.log('run');
		console.log(this.options.queue)
		this.running = false;
	}
}

export default new building_queue();
