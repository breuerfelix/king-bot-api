import fs from 'fs';

class settings{

	dev_mode: boolean = false;

	constructor(){
		if(process.env.DEV == 'true') this.dev_mode = true;
	}

	read_credentials(){
		let cred: string = fs.readFileSync('./cred.txt', 'utf-8');
		let cred_array: string[] = cred.trim().split(';');

		return { email: cred_array[0], password: cred_array[1] };
	}
}

export default new settings();
