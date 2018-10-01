import lowdb from 'lowdb';
import FileSync from 'lowdb/Adapters/FileSync';

import settings from './settings';

const adapter = new FileSync(settings.assets_folder + settings.database_name);

const database = lowdb(adapter);

database.defaults({ account: {} }).write();

export default database;
