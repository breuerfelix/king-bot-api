import lowdb, { AdapterSync } from 'lowdb';
const FileSync = require('lowdb/adapters/FileSync');

import settings from './settings';

const adapter: AdapterSync = new FileSync(settings.assets_folder + settings.database_name);

const database = lowdb(adapter);

database.defaults({ account: {}, hero: { options: {} }, farming: { options: [] }, language: 'en' }).write();

export default database;
