import fs from 'fs';
import path from 'path';

const BASE_DIR: string = path.join(__dirname, '../');

class settings {

	assets_folder: string = BASE_DIR + './assets';
	database_name: string = '/database.json';
	buildings_name: string = '/buildings.json';
	credentials_name: string = '/cred.txt';

	read_credentials(){
		const filename: string = this.assets_folder + this.credentials_name;

		if(!fs.existsSync(filename)) return null;

		let cred: string = fs.readFileSync(filename, 'utf-8');
		let cred_array: string[] = cred.trim().split(';');

		return { email: cred_array[0], password: cred_array[1], gameworld: cred_array[2] };
	}

	get_buildings(): any {
		const filename: string = this.assets_folder + this.buildings_name;

		if(!fs.existsSync(filename)) return null;

		let data: string = fs.readFileSync(filename, 'utf-8');
		return JSON.parse(data);
	}
}

export default new settings();
