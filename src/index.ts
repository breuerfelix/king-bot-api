import api from './api';
import read_credentials from './settings';

class kingbot{
	constructor(){

	}

	async login(gameworld: string): Promise<void>{
		let cred: any = read_credentials();
		await api.login(cred.email, cred.password, gameworld);
	}

	async test(): Promise<void>{
		api.get_all();
	}
}

export default new kingbot();
