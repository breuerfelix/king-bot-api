import { Ihero } from './interfaces';
import { log, find_state_data } from './util';
import { sleep } from './util';
import api from './api';
import village from './village';

class hero {
  hero_ident: string = 'Hero:';

  async auto_adventure(type: number): Promise<void> {
    // to get player id
    const villages_data: any = await village.get_own();
    const player_id: string = find_state_data(village.own_villages_ident, villages_data)[0].data.playerId;

    while(true) {
      // to get hero data
      let response: any[] = await api.get_cache([this.hero_ident + player_id]);
      const hero: Ihero = find_state_data(this.hero_ident + player_id, response);

      if (hero.adventurePoints > 0 && !hero.isMoving && hero.status == 0){
        const res = await api.adventure(type);
        log(`sent hero on small adventure`);
      }

      await sleep(60);
    }
  }
}

export default new hero();
