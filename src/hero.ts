import { Ihero, Iplayer, feature, Ioptions, Ifeature } from './interfaces';
import { log, find_state_data, get_diff_time } from './util';
import { sleep } from './util';
import api from './api';
import player from './player';
import database from './database';

interface Ioptions_hero extends Ioptions {
	type: adventure_type
	min_health: number
}

class hero extends feature {
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
		this.options = { ...this.options, ...options };
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

	start(): void {
		this.auto_adventure(this.options.type, this.options.min_health);
	}

	async auto_adventure(type: adventure_type, min_health: number): Promise<void> {
		try {
			this.running = true;
			log('auto adventure started');

			// write data to database
			this.options.min_health = min_health;
			this.options.type = type;
			this.options.run = true;

			database.set('hero.options', this.options).write();

			const player_data: Iplayer = await player.get();

			while(this.options.run) {
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
		} catch {
			log('error on feature auto adventure');
			this.running = false;
			this.options.run = false;
			this.options.error = true;
		}
	}
}

export enum adventure_type {
	short = 0,
	long = 1
}

export default new hero();
