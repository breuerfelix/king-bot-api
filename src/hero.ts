import { Ihero, Iplayer } from './interfaces';
import { log, find_state_data, get_date, get_diff_time } from './util';
import { sleep } from './util';
import api from './api';
import village from './village';
import player from './player';

class hero {
	hero_ident: string = 'Hero:';

	async auto_adventure(type: adventure_type, min_health: number): Promise<void> {
		const player_data: Iplayer = await player.get();

		while(true) {
			// get hero data
			const response: any[] = await api.get_cache([ this.hero_ident + player_data.playerId]);
			const hero: Ihero = find_state_data(this.hero_ident + player_data.playerId, response);

			if (hero.adventurePoints > 0 && !hero.isMoving && hero.status == 0 && Number(hero.health) > min_health){
				await api.start_adventure(type);
				log('sent hero on adventure');
			}

			const diff_time: number = get_diff_time(hero.untilTime);
			let sleep_time: number = 60;

			if(diff_time > 0) sleep_time = diff_time + 5;

			await sleep(sleep_time);
		}
	}
}

export enum adventure_type {
	short = 0,
	long = 1
}

export default new hero();
