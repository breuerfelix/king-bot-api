import api from './api';
import read_credentials from './settings';

class kingbot{
	constructor(){

	}

	async login(gameworld){
		let cred = read_credentials();
		await api.login(cred.email, cred.password, gameworld);
	}

	async test(){
		api.get_all();
	}
}

export default new kingbot();
