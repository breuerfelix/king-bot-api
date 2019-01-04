import { log, find_state_data, sleep, list_remove, get_random_int } from '../util';
import { Ifarmlist, Ivillage } from '../interfaces';
import { Ifeature, Irequest, feature_collection, feature_item, Ioptions } from './feature';
import { farming, village } from '../gamedata';
import api from '../api';
import database from '../database';
import uniqid from 'uniqid';

interface Ioptions_timed_attack extends Ioptions {
  village_name: string,
  wait_time: number,
  target_x: number,
  target_y: number,
  target_villageId: string,
  target_village_name: string,
  target_playerId: string,
  target_player_name: string,
  target_tribeId: number,
  target_distance: number,
  t1: number,
  t2: number,
  t3: number,
  t4: number,
  t5: number,
  t6: number,
  t7: number,
  t8: number,
  t9: number,
  t10: number,
  t11: number,
}

class timed_attack extends feature_collection {
	get_ident(): string {
		return 'timed_attack';
	}

	get_new_item(options: Ioptions_timed_attack): timed_attack_feature {
		return new timed_attack_feature({ ...options });
	}

	get_default_options(options: Ioptions): Ioptions_timed_attack {
		return {
			...options,
			village_name: '',
      wait_time: 60,
      target_x: 0,
      target_y: 0,
      target_villageId: '',
      target_village_name: '',
      target_playerId: '',
      target_player_name: '',
      target_distance: 0,
      target_tribeId: 0,
      t1: 0,
      t2: 0,
      t3: 0,
      t4: 0,
      t5: 0,
      t6: 0,
      t7: 0,
      t8: 0,
      t9: 0,
      t10: 0,
      t11: 0
		};
	}
}

class timed_attack_feature extends feature_item {
	options: Ioptions_timed_attack;

	set_options(options: Ioptions_timed_attack): void {
		const { uuid, run, error, village_name,
      wait_time,
      target_x,
      target_y,
      target_villageId,
      target_village_name,
      target_playerId,
      target_player_name,
      target_tribeId,
      target_distance,
      t1,
      t2,
      t3,
      t4,
      t5,
      t6,
      t7,
      t8,
      t9,
      t10,
      t11} = options;

		this.options = {
			...this.options,
			uuid,
			run,
			error,
      village_name,
      wait_time,
      target_x,
      target_y,
      target_villageId,
      target_village_name,
      target_playerId,
      target_player_name,
      target_tribeId,
      target_distance,
      t1,
      t2,
      t3,
      t4,
      t5,
      t6,
      t7,
      t8,
      t9,
      t10,
      t11
      
		};
	}

	get_options(): Ioptions_timed_attack {
		return { ...this.options };
	}

	set_params(): void {
		this.params = {
			ident: 'timed_attack',
      name: 'timed attack'
		};
	}

	get_description(): string {
		const { village_name} = this.options;
		return `${village_name}`;
	}

	get_long_description(): string {
		return 'sends merchants from the origin village to the desination at a given interval.';
	}

	async run(): Promise<void> {
    log(`attack timer uuid: ${this.options.uuid} started`);

		const { village_name, wait_time, target_villageId } = this.options;

    while (this.options.run) {
      log(target_villageId)
      await sleep(wait_time);

    }

    log(`attack timer uuid: ${this.options.uuid} stopped`);
		this.running = false;
		this.options.run = false;
  }
}

export default new timed_attack();
