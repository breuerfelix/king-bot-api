import database from './database';
import uniqid from 'uniqid';
import { log, list_remove } from './util';

export interface Ifeature_params extends Ifeature, Ioptions {
	description?: string
}

export interface Ioptions {
	uuid?: string
	run: boolean
	error: boolean
}

export interface Ifeature {
	ident: string
	name: string
}

export interface Irequest {
	action: string
	feature: Ifeature_params
}

export abstract class feature {
	running: boolean = false;

	params: Ifeature;

	abstract set_default_options(): void;
	abstract set_params(): void;
	abstract set_options(options: Ioptions): void;

	abstract get_options(): Ioptions;
	abstract get_description(): string;

	abstract update(options: Ioptions): void;
	abstract async run(): Promise<void>;

	constructor() {
		this.set_params();

		const options: Ioptions = database.get(`${this.params.ident}.options`).value();

		if(!options) this.set_default_options();
		else this.set_options({ ...options });
	}

	get_feature_params(): Ifeature_params {
		return { ...this.params, description: this.get_description(), ...this.get_options() };
	}

	start_for_server(): void {
		if(this.get_options().run) this.start();
	}

	stop(): void {
		this.set_options({ ...this.get_options(), run: false });
		this.save();
	}

	start(): void {
		this.set_options({ ...this.get_options(), run: true });
		this.save();

		try {
			this.running = true;
			this.run();
		} catch {
			this.running = false;
			this.set_options({ ...this.get_options(), run: false, error: true });
		}
	}

	save(): void {
		database.set(`${this.params.ident}.options`, this.get_options()).write();
	}

	handle_request(payload: Irequest): any {
		const { action } = payload;

		if(action == 'start') {
			this.set_options({ ...this.get_options(), run: true });
			if(!this.running) this.start();
			else this.save();

			return 'online';
		}

		if(action == 'stop') {
			this.stop();

			return 'offline';
		}

		if(action == 'update') {
			this.update({ ...payload.feature });
			this.save();

			return 'success';
		}

		return 'error';
	}
}

export abstract class feature_collection {
	features: feature_item[] = []

	abstract get_database_ident(): string;
	abstract get_new_item(options: Ioptions): feature_item;

	constructor() {
		const options: Ioptions[] = database.get(`${this.get_database_ident()}.options`).value();

		if(!options) return;

		for(let opt of options) {
			this.features.push(this.get_new_item(opt));
		}
	}

	get_feature_params(): Ifeature_params[] {
		const params: Ifeature_params[] = [];
		for(let feat of this.features) params.push(feat.get_feature_params());
		return params;
	}

	save(): void {
		const options: Ioptions[] = [];
		for(let feat of this.features) options.push(feat.get_options());
		database.set(`${this.get_database_ident()}.options`, options).write();
	}

	start_for_server(): void {
		for(let feat of this.features)
			if(feat.get_options().run)
				feat.start();
	}

	handle_request(payload: Irequest): any {
		const { action } = payload;

		if(action == 'new') {
			const uuid: string = uniqid.time();

			const options: Ioptions = {
				uuid,
				run: false,
				error: false
			};

			const feat: feature_item = this.get_new_item(options);
			this.features.push(feat);

			this.save();
			
			return feat.get_feature_params();
		}

		const { uuid } = payload.feature;
		const feature: feature_item = this.features.find(x => x.get_options().uuid == uuid);

		if(!feature) return 'error';

		if(action == 'start') {
			feature.set_options({ ...feature.get_options(), run: true });
			if(!feature.running) feature.start();

			this.save();

			return 'online';
		}

		if(action == 'stop') {
			feature.stop();
			this.save();

			return 'offline';
		}

		if(action == 'update') {
			const { uuid, run } = feature.get_options();
			feature.stop();
			list_remove(feature, this.features);

			const new_feature: feature_item = this.get_new_item({
				...payload.feature,
				uuid,
				run,
				error: false
			});

			this.features.push(new_feature);

			this.save();

			if(run) new_feature.start();

			return 'success';
		}

		if(action == 'delete') {
			feature.stop();
			list_remove(feature, this.features);
			this.save();
			
			return 'success';
		}

		return 'error';
	}
}

export abstract class feature_item {
	running: boolean = false;
	params: Ifeature;

	abstract async run(): Promise<void>;
	abstract get_options(): Ioptions;
	abstract set_options(options: Ioptions): void;
	abstract set_params(): void;
	abstract get_description(): string;

	constructor(options: Ioptions) {
		this.set_params();

		this.set_options(options);
	}
	
	get_feature_params(): Ifeature_params {
		return { ...this.params, description: this.get_description(), ...this.get_options() };
	}

	stop(): void {
		this.set_options({ ...this.get_options(), run: false });
	}

	start(): void {
		this.set_options({ ...this.get_options(), run: true });

		try {
			this.running = true;
			this.run();
		} catch {
			this.running = false;
			this.set_options({ ...this.get_options(), run: false, error: true });
		}
	}
}
