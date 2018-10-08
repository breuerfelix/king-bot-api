import lowdb, { AdapterSync } from 'lowdb';
const FileSync = require('lowdb/Adapters/FileSync');

import settings from './settings';

const adapter: AdapterSync = new FileSync(settings.assets_folder + settings.database_name);

const database = lowdb(adapter);

database.defaults({ account: {} }).write();

export default database;
