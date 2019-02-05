import { log, find_state_data, sleep, list_remove, get_random_int } from '../util';
import { Ifarmlist, Ivillage, Iunits, Iplayer } from '../interfaces';
import { Ifeature, Irequest, feature_collection, feature_item, Ioptions } from './feature';
import { farming, village, player } from '../gamedata';
import api from '../api';
import database from '../database';
import uniqid from 'uniqid';
import { troops, tribe } from '../data';

	interface Ioptions_timed_attack extends Ioptions {
		village_name: string,
		wait_time: number,
		target_villageId: number,
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
		date: string,
		time: string
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
			target_villageId: 0,
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
			t11: 0,
			date: '',
			time: ''
		};
	}
}

class timed_attack_feature extends feature_item {
		options: Ioptions_timed_attack;

		set_options(options: Ioptions_timed_attack): void {
			const { uuid, run, error, village_name,
				wait_time,
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
				t11,
				date,
				time } = options;

			this.options = {
				...this.options,
				uuid,
				run,
				error,
				village_name,
				wait_time,
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
				t11,
				date,
				time

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
			const { village_name, target_village_name } = this.options;
			return `${village_name} -> ${target_village_name} : ${this.options.wait_time}`;
		}

		get_long_description(): string {
			return 'sends merchants from the origin village to the desination at a given interval.';
		}

		async run(): Promise<void> {
			log(`attack timer uuid: ${this.options.uuid} started`);

			var { village_name, target_villageId, target_distance, target_village_name, t1, t2, t3, t4, t5, t6, t7, t8, t9, t10, t11, date, time } = this.options;
			const params = [
				village.own_villages_ident,
			];

			const response = await api.get_cache(params);
			const vill: Ivillage = village.find(village_name, response);
			const sourceVillage_id = vill.villageId;
			const units: Iunits = {
				1: Number(t1),
				2: Number(t2),
				3: Number(t3),
				4: Number(t4),
				5: Number(t5),
				6: Number(t6),
				7: Number(t7),
				8: Number(t8),
				9: Number(t9),
				10: Number(t10),
				11: Number(t11)
			};

			var speed = 100;

			const player_data: Iplayer = await player.get();
			const own_tribe: tribe = player_data.tribeId;

			for (var i = 1; i < 11; i++) {
				if (troops[own_tribe][i].speed < speed && units[i] > 0) speed = troops[own_tribe][i].speed;
			}

			const duration = 3600000 * target_distance / speed;
			const attack_time = new Date(date + 'T' + time + 'Z');
			const attack_time_sec = attack_time.getTime();

			while (this.options.run) {
				this.set_options(this.options);
				var currentTime = Date.now();

				if (attack_time_sec - duration < currentTime - 1000) {
					if (attack_time_sec - duration < currentTime) {
						log(`attacking: ${village_name} -> ${target_village_name}`);
						await api.send_units(sourceVillage_id, target_villageId, units, 3);
						this.running = false;
						this.options.run = false;
					}
					else {
						await sleep(.25);
					}

				}
				else {
					await sleep(1);
				}


			}

			log(`attack timer uuid: ${this.options.uuid} stopped`);
			this.running = false; //need to figure out how to delete this along with stop.
			this.options.run = false;
		}
}

export default new timed_attack();
