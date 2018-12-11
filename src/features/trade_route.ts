import { log, find_state_data, sleep, list_remove, get_random_int } from '../util';
import { Ifarmlist, Ivillage } from '../interfaces';
import { Ifeature, Irequest, feature_collection, feature_item, Ioptions } from './feature';
import { farming, village } from '../gamedata';
import api from '../api';
import database from '../database';
import uniqid from 'uniqid';

interface Ioptions_trade extends Ioptions {
  source_village_name: string
  destination_village_name: string
  interval_min: number
  interval_max: number
  send_wood: number
  send_clay: number
  send_iron: number
  send_crop: number
  source_wood: number
  source_clay: number
  source_iron: number
  source_crop: number
  destination_wood: number
  destination_clay: number
  destination_iron: number
  destination_crop: number
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
      source_village_name: '',
      destination_village_name: '',
      interval_min: 0,
      interval_max: 0,
      send_wood: 0,
      send_clay: 0,
      send_iron: 0,
      send_crop: 0,
      source_wood: 0,
      source_clay: 0,
      source_iron: 0,
      source_crop: 0,
      destination_wood: 0,
      destination_clay: 0,
      destination_iron: 0,
      destination_crop: 0
    };
  }
}

class trade_feature extends feature_item {
  options: Ioptions_trade;

  set_options(options: Ioptions_trade): void {
    const { uuid, run, error, source_village_name, destination_village_name, interval_min, interval_max, 
      send_wood, 
      send_clay, 
      send_iron, 
      send_crop,
      source_wood,
      source_clay,
      source_iron,
      source_crop,
      destination_wood,
      destination_clay,
      destination_iron,
      destination_crop } = options;
    this.options = {
      ...this.options,
      uuid,
      run,
      error,
      source_village_name,
      destination_village_name,
      interval_min,
      interval_max,
      send_wood,
      send_clay,
      send_iron,
      send_crop,
      source_wood,
      source_clay,
      source_iron,
      source_crop,
      destination_wood,
      destination_clay,
      destination_iron,
      destination_crop
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
    const { source_village_name, destination_village_name, interval_min, interval_max } = this.options;
    return `${source_village_name} -> ${destination_village_name} | ${interval_min} - ${interval_max}s`;
  }

  get_long_description(): string {
    return 'Sends merchants from the origin village to the desination at a given interval.';
  }

  async run(): Promise<void> {
    log(`trading uuid: ${this.options.uuid} started`);

    const { source_village_name, destination_village_name, interval_min, interval_max, send_wood, send_clay, send_iron, send_crop } = this.options;

    const params = [
      village.own_villages_ident,
    ];

    const response = await api.get_cache(params);
    const vill: Ivillage = village.find(source_village_name, response);
    const vill2: Ivillage = village.find(destination_village_name, response);
    if (!vill) {
      this.running = false;
      return;
    }

    const sourceVillage_id: number = vill.villageId;
    const destVillage_id: number = vill2.villageId;
    while (this.options.run) {
      const response = await api.get_cache(params);
      const vill: Ivillage = village.find(source_village_name, response);
      var resources = [0, 0, 0, 0, 0]
      resources[1] = Math.min(send_wood, vill.storage['1']);
      resources[2] = Math.min(send_clay, vill.storage['2']);
      resources[3] = Math.min(send_iron, vill.storage['3']);
      resources[4] = Math.min(send_crop, vill.storage['4']);
      await api.send_merchants(sourceVillage_id, destVillage_id, resources);
      log(`Trade ${resources} sent from ${source_village_name} to ${destination_village_name}`);


      await sleep(get_random_int(interval_min, interval_max));
    }

    log(`trading uuid: ${this.options.uuid} stopped`);
    this.running = false;
    this.options.run = false;
  }
}

export default new trade_route();
