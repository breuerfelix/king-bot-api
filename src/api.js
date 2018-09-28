import axios from 'axios';
import login_to_gameworld from './login';


class api {
	constructor(){
		this.ax = axios.create();
		this.ax.defaults.withCredentials = true;
		this.ax.defaults.crossDomain = true;
	}

	async login(email, password, gameworld){
		let rv = await login_to_gameworld(this.ax, email, password, gameworld);

		// assign login credentials
		this.session = rv.session;
		this.token = rv.token;
		this.msid = rv.msid;

		// set baseURL
		this.ax.defaults.baseURL = `https://${gameworld.toLowerCase()}.kingdoms.com/api`;
	}

	async get_all(){
		let session = this.session;

		const payload = {
			controller: 'player',
			action: 'getAll',
			params: {},
			session
		};

		let response = await this.ax.post(`/?c=player&a=getAll&t${Date.now()}`, payload);
		console.log(response.data)
	}
}

export default new api();
