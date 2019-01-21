import fs from 'fs';
import path from 'path';
// @ts-ignore
import ip from 'public-ip';

const BASE_DIR: string = path.join(__dirname, '../');

class settings {
	assets_folder: string = BASE_DIR + './assets';
	database_name: string = '/database.json';
	buildings_name: string = '/buildings.json';
	credentials_name: string = '/cred.txt';

	gameworld: string;
	email: string;
	ip: string;

	async init(): Promise<void> {
		try {
			this.ip = await ip.v4();
		} catch {
			this.ip = '0.0.0.0';
		}
	}

	read_credentials(): Icredentials {
		const filename: string = this.assets_folder + this.credentials_name;

		if (!fs.existsSync(filename)) return null;

		let cred: string = fs.readFileSync(filename, 'utf-8');
		let cred_array: string[] = cred.trim().split(';');

		return { email: cred_array[0], password: cred_array[1], gameworld: cred_array[2] };
	}
}

interface Icredentials {
	email: string
	password: string
	gameworld: string
}

export default new settings();
