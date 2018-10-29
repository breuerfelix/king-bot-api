import { Ihero, Iplayer } from '../interfaces';
import { feature, Ioptions, Ifeature } from '../feature';
import { log, find_state_data, get_diff_time, sleep } from '../util';
import api from '../api';
import { player } from '../gamedata';
import database from '../database';

interface Ioptions_hero extends Ioptions {
	type: adventure_type
	min_health: number
}

class auto_adventure extends feature {
	// idents for state data
	hero_ident: string = 'Hero:';

	options: Ioptions_hero;

	set_default_options(): void {
		this.options = {
			type: 0,
			min_health: 15,
			run: false,
			error: false
		}
	}

	set_params(): void {
		this.params = {
			ident: 'hero',
			name: 'auto adventure'
		};
	}

	set_options(options: Ioptions_hero): void {
		const { run, error, type, min_health } = options;
		this.options = {
			...this.options,
			type,
			min_health,
			run,
			error
		};
	}

	get_options(): Ioptions {
		return { ...this.options };
	}

	get_description(): string {
		return (this.options.type == 0) ? 'short' : 'long';
	}

	update(options: Ioptions_hero): void {
		this.options = {
			...this.options,
			min_health: options.min_health,
			type: options.type
		};
	}

	async run(): Promise<void> {
		this.auto_adventure(this.options.type, this.options.min_health);
	}

	async auto_adventure(type: adventure_type, min_health: number): Promise<void> {
		log('auto adventure started');

		// write data to database
		this.options.min_health = min_health;
		this.options.type = type;
		this.options.run = true;

		database.set('hero.options', this.options).write();

		const player_data: Iplayer = await player.get();

		while(this.options.run) {
			const { type, min_health } = this.options;

			// get hero data
			const response: any[] = await api.get_cache([ this.hero_ident + player_data.playerId]);
			const hero: Ihero = find_state_data(this.hero_ident + player_data.playerId, response);

			if (hero.adventurePoints > 0 && !hero.isMoving && hero.status == 0 && Number(hero.health) > min_health){
				let send: boolean = false;

				if(type == adventure_type.short && Number(hero.adventurePoints) > 0)
					send = true;
				else if(type == adventure_type.long && Number(hero.adventurePoints > 1))
					send = true;

				if(send) {
					await api.start_adventure(type);
					log('sent hero on adventure');
				}
			}

			const diff_time: number = get_diff_time(hero.untilTime);
			let sleep_time: number = 60;

			if(diff_time > 0) sleep_time = diff_time + 5;

			await sleep(sleep_time);
		}

		this.running = false;
		log('auto adventure stopped');
	}
}

export enum adventure_type {
	short = 0,
	long = 1
}

export default new auto_adventure();
