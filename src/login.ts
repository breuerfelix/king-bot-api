import qs from 'qs';
import cheerio from 'cheerio';
import { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { clash_obj, log } from './util';
import database from './database';

const ci = cheerio;
const lobby_endpoint: string = 'https://lobby.kingdoms.com/api/index.php';


async function manage_login(axios: AxiosInstance, email: string, password: string, gameworld: string): Promise<any> {

	gameworld = gameworld.toLowerCase();

	let db_email = database.get('account.email').value();
	let db_gameworld = database.get('account.gameworld').value();

	if(db_email === email) {
		log('found lobby session in database...');

		// get credentials from database
		const { session_lobby, cookies_lobby, msid } = database.get('account').value();

		axios.defaults.headers['Cookie'] = cookies_lobby;

		if(await test_lobby_connection(axios, session_lobby)) {
			log('database lobby connection successful');

			if(db_gameworld === gameworld) {
				log('found gameworld session in database ...');

				// get credentials from database
				const { session_gameworld, cookies_gameworld } = database.get('account').value();

				axios.defaults.headers['Cookie'] += cookies_gameworld;
				if(await test_gameworld_connection(axios, gameworld, session_gameworld)) {
					log('database gameworld connection successful');
					return;
				}
			}

			await login_to_gameworld(axios, gameworld, msid, session_lobby);	
			return;
		}
	}


	const { msid, session_lobby } = await login_to_lobby(axios, email, password);

	await login_to_gameworld(axios, gameworld, msid, session_lobby);

	return;
}

async function login_to_lobby(axios: AxiosInstance, email: string, password: string): Promise<any> {
	let res: AxiosResponse, options: AxiosRequestConfig, url: string, msid: string, token_lobby: string, session_lobby: string;

	// get msid
	res = await axios.get('https://mellon-t5.traviangames.com/authentication/login/ajax/form-validate?');
	let $ = ci.load(res.data);
	let html: string = $.html();

	let startIndex: number = html.indexOf('msid');
	let endIndex: number = html.indexOf('{}', startIndex);
	msid = html.substring(startIndex, endIndex);

	msid = msid.substring(msid.indexOf(',') + 3, msid.lastIndexOf('"'));
	console.log('msid: ' + msid);
	
	// logs in with credentials from file
	url = `https://mellon-t5.traviangames.com/authentication/login/ajax/form-validate?msid=${msid}&msname=msid`;

	let credentials: any = { email, password };

	options = {
		method: 'POST',
		headers: { 'content-type': 'application/x-www-form-urlencoded' },
		data: qs.stringify(credentials),
		url,
	};
	
	// gets token
	res = await axios(options);

	let rv: any = parse_token(res.data);
	let tokenURL: string = rv.url;
	token_lobby = rv.token;
	console.log('token: ' + token_lobby);

	options = {
		method: 'GET',
		url: tokenURL,
		maxRedirects: 0,
		validateStatus: validate_cookie_status,
	};

	let cookies: AxiosResponse = await axios(options);
	options.url = cookies.headers.location;	
	cookies = await axios(options);

	// set lobby cookies
	let cookies_lobby = parse_cookies(cookies.headers['set-cookie'].slice(2));
	axios.defaults.headers['Cookie'] = cookies_lobby;

	let sessionLink: string = cookies.headers.location;
	session_lobby = sessionLink.substring(sessionLink.lastIndexOf('=') + 1);
	console.log('sessionID: ' + session_lobby);

	// last lobby session link, there are no information to get from for now
	//let lastLobbyURL = 'https://lobby.kingdoms.com/' + sessionLink;
	//await axios.get(lastLobbyURL);
	
	log('logged into lobby with account ' + email);
	
	// set values to database
	database.set('account.msid', msid).write();
	database.set('account.token_lobby', token_lobby).write();
	database.set('account.session_lobby', session_lobby).write();
	database.set('account.cookies_lobby', cookies_lobby).write();
	database.set('account.email', email).write();
	
	return { msid, session_lobby, token_lobby, cookies_lobby };
}

async function login_to_gameworld(axios: AxiosInstance, gameworld: string, msid: string, session_lobby: string): Promise<any> {
	let res: AxiosResponse, options: AxiosRequestConfig, token_gameworld: string, session_gameworld: string;
	gameworld = gameworld.toLowerCase();

	let gameworldID: string = await get_gameworld_id(axios, session_lobby, gameworld);

	// get gameworld token
	let mellonURL: any = `https://mellon-t5.traviangames.com/game-world/join/gameWorldId/${gameworldID}?msname=msid&msid=${msid}`;

	res = await axios.get(mellonURL);
	let rv: any = parse_token(res.data);

	token_gameworld = rv.token;
	console.log('new token: ' + token_gameworld);

	res = await axios.get(rv.url);

	// get gameworld token
	let worldURL: string = `https://${gameworld}.kingdoms.com/api/login.php?token=${token_gameworld}&msid=${msid}&msname=msid`;

	options = {
		method: 'GET',
		url: worldURL,
		maxRedirects: 0,
		validateStatus: validate_cookie_status,
	};

	res = await axios(options);
	
	// set gameworld cookies
	let cookies_gameworld = parse_cookies(res.headers['set-cookie']);
	axios.defaults.headers['Cookie'] += cookies_gameworld;

	// get new sessionID
	let sessionLink = res.headers.location;
	session_gameworld = sessionLink.substring(sessionLink.lastIndexOf('=') + 1);
	console.log('new sessionID: ' + session_gameworld);

	// last session link, there are no information to get from for now
	//let gameworldURL = `https://${gameworld}.kingdoms.com/` + sessionLink;
	//await axios.get(gameworldURL);
	
	log('logged into gameworld ' + gameworld);

	// set values to database
	database.set('account.token_gameworld', token_gameworld).write();
	database.set('account.session_gameworld', session_gameworld).write();
	database.set('account.cookies_gameworld', cookies_gameworld).write();
	database.set('account.gameworld', gameworld).write();

	return { session_gameworld, token_gameworld, cookies_gameworld };
}

function parse_token(raw_html: string): object{
	let $ = ci.load(raw_html);

	let html: string = $.html();
	let urlIndex: number = html.indexOf('url:');
	let urlEndIndex: number = html.indexOf('}', urlIndex);

	let tokenURL: string = html.substring(urlIndex, urlEndIndex);
	tokenURL = tokenURL.substring(tokenURL.indexOf('\'') + 1, tokenURL.lastIndexOf('\''));
	let token: string = tokenURL.substring(tokenURL.indexOf('token=') + 'token='.length, tokenURL.indexOf('&', tokenURL.indexOf('token')));

	return { url: tokenURL, token };
}

function parse_cookies(cookie_array: any[]): string{
	let cookie_string: string = '';
	cookie_array.forEach(x => {
		let uri = x.substring(0, x.indexOf(';') + 2);
		uri = uri.replace(new RegExp('%3A', 'g'), ':');
		uri = uri.replace(new RegExp('%2C', 'g'), ',');
		cookie_string += decodeURI(uri);
	});

	return cookie_string;
}

function validate_cookie_status(status: number): boolean{
	return status >= 200 && status < 303;
}

async function get_gameworld_id(axios: AxiosInstance, session: string, gameworld_string: string): Promise<string>{
	const payload: object = {
		action: 'get',
		controller: 'cache',
		params: {
			names: [ 'Collection:Avatar:' ]
		},
		session
	};

	const res: AxiosResponse = await axios.post(lobby_endpoint, payload);

	let gameworlds: any = clash_obj(res.data, 'cache', 'response');
	gameworlds = gameworlds[0].data;

	let gameworld_id: string = '';

	gameworlds.forEach((x: any) => {
		if(x.data.worldName.toLowerCase() === gameworld_string)
			gameworld_id = x.data.consumersId;
	});

	return gameworld_id;
}

async function test_lobby_connection(axios: AxiosInstance, session: string): Promise<boolean> {

	const payload = {
		action: 'getAll',
		controller: 'player',
		params: {},
		session
	};

	const response = await axios.post(lobby_endpoint, payload);

	return !response.data.error;
}

async function test_gameworld_connection(axios: AxiosInstance, gameworld: string, session: string): Promise<boolean> {

	const payload = {
		action: 'getAll',
		controller: 'player',
		params: {},
		session
	};

	const response = await axios.post(`https://${gameworld}.kingdoms.com/api/?c=player&a=getAll&t${Date.now()}`, payload);

	return !response.data.error;
}

export default manage_login;
