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
		console.log(rv)
	}
}

export default new api();
