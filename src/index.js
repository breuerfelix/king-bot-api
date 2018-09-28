import api from './api';
import read_credentials from './settings';

class kingbot{
	constructor(){

	}

	async login(){
		let cred = read_credentials();
		await api.login(cred.email, cred.password, 'com2');
	}
}

export default new kingbot();
