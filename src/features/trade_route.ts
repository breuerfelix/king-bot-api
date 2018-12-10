import { log, find_state_data, sleep, list_remove, get_random_int } from '../util';
import { Ifarmlist, Ivillage } from '../interfaces';
import { Ifeature, Irequest, feature_collection, feature_item, Ioptions } from './feature';
import { farming, village } from '../gamedata';
import api from '../api';
import database from '../database';
import uniqid from 'uniqid';

interface Ioptions_trade extends Ioptions {
  origin_village_name: string
  destination_village_name: string
  interval_min: number
  interval_max: number
  wood: number
  clay: number
  iron: number
  crop: number
}

class trade_route extends feature_collection {
  get_ident(): string {
    return 'trade_route';
  }

  get_new_item(options: Ioptions_trade): trade_feature {
    return new trade_feature({ ...options });
  }

  get_default_options(options: Ioptions): Ioptions_trade {
    return {
      ...options,
      origin_village_name: '',
      destination_village_name: '',
      interval_min: 0,
      interval_max: 0,
      wood: 0,
      clay: 0,
      iron: 0,
      crop: 0
    };
  }
}

class trade_feature extends feature_item {
  options: Ioptions_trade;

  set_options(options: Ioptions_trade): void {
    const { uuid, run, error, origin_village_name, destination_village_name, interval_min, interval_max, wood, clay, iron, crop } = options;
    this.options = {
      ...this.options,
      uuid,
      run,
      error,
      origin_village_name,
      destination_village_name,
      interval_min,
      interval_max,
      wood,
      clay,
      iron,
      crop
    };
  }

  get_options(): Ioptions_trade {
    return { ...this.options };
  }

  set_params(): void {
    this.params = {
      ident: 'trade_route',
      name: 'trade route'
    };
  }

  get_description(): string {
    const { origin_village_name, destination_village_name, interval_min, interval_max } = this.options;
    return `${origin_village_name} -> ${destination_village_name} | ${interval_min} - ${interval_max}s`;
  }

  get_long_description(): string {
    return 'Sends merchants from the origin village to the desination at a given interval.';
  }

  async run(): Promise<void> {
    log(`trading uuid: ${this.options.uuid} started`);

    const { origin_village_name, destination_village_name, interval_min, interval_max, wood, clay, iron, crop } = this.options;

    const params = [
      village.own_villages_ident,
    ];

    const response = await api.get_cache(params);
    const vill: Ivillage = village.find(origin_village_name, response);
    const vill2: Ivillage = village.find(destination_village_name, response);
    if (!vill) {
      this.running = false;
      return;
    }

    const sourceVillage_id: number = vill.villageId;
    const destVillage_id: number = vill2.villageId;
    while (this.options.run) {
      const response = await api.get_cache(params);
      const vill: Ivillage = village.find(origin_village_name, response);
      var resources = [0, 0, 0, 0, 0]
      resources[1] = Math.min(wood, vill.storage['1']);
      resources[2] = Math.min(clay, vill.storage['2']);
      resources[3] = Math.min(iron, vill.storage['3']);
      resources[4] = Math.min(crop, vill.storage['4']);
      await api.send_merchants(sourceVillage_id, destVillage_id, resources);
      log(`Trade ${resources} sent from ${origin_village_name} to ${destination_village_name}`);


      await sleep(get_random_int(interval_min, interval_max));
    }

    log(`trading uuid: ${this.options.uuid} stopped`);
    this.running = false;
    this.options.run = false;
  }
}

export default new trade_route();
