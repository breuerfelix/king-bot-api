import { Iplayer } from './interfaces';
import { log, find_state_data } from './util';
import api from './api';
import village from './village';

class player {
	ident: string = 'Player:';

	async get(): Promise<Iplayer> {
		const villages_data: any = await village.get_own();
		const player_id: string = find_state_data(village.own_villages_ident, villages_data)[0].data.playerId;

		const params = [ this.ident + player_id ];

		const response = await api.get_cache(params);
		const player_data: Iplayer = find_state_data(this.ident + player_id, response);

		return player_data;
	}
}

export default new player();
