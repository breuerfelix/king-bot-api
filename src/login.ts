import qs from 'qs';
import cheerio from 'cheerio';
import logger from './logger';
import { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { clash_obj, log } from './util';
import database from './database';
import settings from './settings';

const ci = cheerio;
const lobby_endpoint: string = 'https://lobby.kingdoms.com/api/index.php';

async function manage_login(
	axios: AxiosInstance,
	email: string,
	password: string,
	gameworld: string,
	sitter_type: string,
	sitter_name: string
): Promise<any> {

	gameworld = gameworld.toLowerCase();
	sitter_type = sitter_type.toLowerCase();
	sitter_name = sitter_name.toLowerCase();

	settings.email = email;
	settings.gameworld = gameworld;
	settings.sitter_name = sitter_name;
	settings.sitter_type = sitter_type;

	let db_email = database.get('account.email').value();
	let db_gameworld = database.get('account.gameworld').value();
	let db_sitter_type = database.get('account.sitter_type').value();
	let db_sitter_name = database.get('account.sitter_name').value();

	if (db_email === email) {
		logger.info('found lobby session in database...', 'login');

		// get credentials from database
		const { session_lobby, cookies_lobby, msid } = database.get('account').value();

		axios.defaults.headers['Cookie'] = cookies_lobby;

		if (await test_lobby_connection(axios, session_lobby)) {
			logger.info('database lobby connection successful', 'login');

			if (db_gameworld === gameworld && db_sitter_name === sitter_name && db_sitter_type === sitter_type) {
				logger.info('found gameworld session in database ...', 'login');

				// get credentials from database
				const { session_gameworld, cookies_gameworld } = database.get('account').value();

				axios.defaults.headers['Cookie'] += cookies_gameworld;
				if (await test_gameworld_connection(axios, gameworld, session_gameworld)) {
					logger.info('database gameworld connection successful', 'login');
					return;
				} else {
					logger.warn('database connection to gameworld failed', 'login');
				}
			}

			await login_to_gameworld(axios, gameworld, sitter_type, sitter_name, msid, session_lobby);
			return;
		} else {
			logger.warn('database connection to lobby failed', 'login');
		}
	}


	const { msid, session_lobby } = await login_to_lobby(axios, email, password);

	await login_to_gameworld(axios, gameworld, sitter_type, sitter_name, msid, session_lobby);

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
	logger.info('msid: ' + msid, 'login');

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

	if (!token_lobby) {
		logger.error('error parsing lobby cookies. maybe you entered wrong credentials ?');
		process.exit();
	}

	logger.info('token: ' + token_lobby, 'login');

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
	logger.info('sessionID: ' + session_lobby, 'login');

	// last lobby session link, there are no information to get from for now
	//let lastLobbyURL = 'https://lobby.kingdoms.com/' + sessionLink;
	//await axios.get(lastLobbyURL);

	logger.info('logged into lobby with account ' + email, 'login');

	// set values to database
	database.set('account.msid', msid).write();
	database.set('account.token_lobby', token_lobby).write();
	database.set('account.session_lobby', session_lobby).write();
	database.set('account.cookies_lobby', cookies_lobby).write();
	database.set('account.email', email).write();

	return { msid, session_lobby, token_lobby, cookies_lobby };
}

async function login_to_gameworld(
	axios: AxiosInstance,
	gameworld: string,
	sitter_type: string,
	sitter_name: string,
	msid: string,
	session_lobby: string
): Promise<any> {

	let res: AxiosResponse, options: AxiosRequestConfig, token_gameworld: string, session_gameworld: string;
	gameworld = gameworld.toLowerCase();

	let mellonURL: string;

	if (sitter_type && sitter_name) {
		// login to sitter or dual account
		let avatarID: string = await get_avatar_id(axios, session_lobby, gameworld, sitter_type, sitter_name);
		mellonURL = `https://mellon-t5.traviangames.com/game-world/join-as-guest/avatarId/${avatarID}?msname=msid&msid=${msid}`;
	} else {
		// login to normal gameworld
		let gameworldID: string = await get_gameworld_id(axios, session_lobby, gameworld);
		mellonURL = `https://mellon-t5.traviangames.com/game-world/join/gameWorldId/${gameworldID}?msname=msid&msid=${msid}`;
	}

	try {
		res = await axios.get(mellonURL);
	} catch {
		logger.error('error login to gameworld. could you entered the wrong one?', 'login');
		process.exit();
	}

	let rv: any = parse_token(res.data);

	token_gameworld = rv.token;
	logger.info('new token: ' + token_gameworld, 'login');

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
	logger.info('new sessionID: ' + session_gameworld, 'login');

	// last session link, there are no information to get from for now
	//let gameworldURL = `https://${gameworld}.kingdoms.com/` + sessionLink;
	//await axios.get(gameworldURL);

	logger.info('logged into gameworld ' + gameworld, 'login');

	// set values to database
	database.set('account.token_gameworld', token_gameworld).write();
	database.set('account.session_gameworld', session_gameworld).write();
	database.set('account.cookies_gameworld', cookies_gameworld).write();
	database.set('account.gameworld', gameworld).write();
	database.set('account.sitter_type', sitter_type).write();
	database.set('account.sitter_name', sitter_name).write();

	return { session_gameworld, token_gameworld, cookies_gameworld };
}

function parse_token(raw_html: string): object {
	let $ = ci.load(raw_html);

	let html: string = $.html();
	let urlIndex: number = html.indexOf('url:');
	let urlEndIndex: number = html.indexOf('}', urlIndex);

	let tokenURL: string = html.substring(urlIndex, urlEndIndex);
	tokenURL = tokenURL.substring(tokenURL.indexOf('\'') + 1, tokenURL.lastIndexOf('\''));
	let token: string = tokenURL.substring(tokenURL.indexOf('token=') + 'token='.length, tokenURL.indexOf('&', tokenURL.indexOf('token')));

	return { url: tokenURL, token };
}

function parse_cookies(cookie_array: any[]): string {
	let cookie_string: string = '';
	cookie_array.forEach(x => {
		let uri = x.substring(0, x.indexOf(';') + 2);
		uri = uri.replace(new RegExp('%3A', 'g'), ':');
		uri = uri.replace(new RegExp('%2C', 'g'), ',');
		cookie_string += decodeURI(uri);
	});

	return cookie_string;
}

function validate_cookie_status(status: number): boolean {
	return status >= 200 && status < 303;
}

async function get_gameworld_id(axios: AxiosInstance, session: string, gameworld_string: string): Promise<string> {
	const payload: object = {
		action: 'get',
		controller: 'cache',
		params: {
			names: ['Collection:Avatar:']
		},
		session
	};

	const res: AxiosResponse = await axios.post(lobby_endpoint, payload);

	let gameworlds: any = clash_obj(res.data, 'cache', 'response');
	gameworlds = gameworlds[0].data;

	let gameworld_id: string = '';

	gameworlds.forEach((x: any) => {
		if (x.data.worldName.toLowerCase() === gameworld_string)
			gameworld_id = x.data.consumersId;
	});

	return gameworld_id;
}

async function get_avatar_id(
	axios: AxiosInstance,
	session: string,
	gameworld_string: string,
	sitter_type: string,
	sitter_name: string
): Promise<string> {

	// ignore sitter type for now

	// there are only 4 sitter spots right now, but just to be safe
	const sitterArray: string[] = [];
	for (let i = 0; i < 10; i++) {
		sitterArray.push('Collection:Sitter:' + i);
	}

	const payload: object = {
		action: 'get',
		controller: 'cache',
		params: {
			names: sitterArray
		},
		session
	};

	const res: AxiosResponse = await axios.post(lobby_endpoint, payload);
	let sitters: any = clash_obj(res.data, 'cache', 'response');

	for (let sitter of sitters) {
		for (let data of sitter.data) {
			let s_data = data.data;

			if (s_data.worldName.toLowerCase() == gameworld_string && s_data.avatarName.toLowerCase() == sitter_name) {
				return s_data.avatarIdentifier;
			}
		}
	}

	logger.error(`sitter_name: ${sitter_name} and gameworld: ${gameworld_string} do not match with any sitter spot.`, 'login');
	process.exit();
}

async function test_lobby_connection(axios: AxiosInstance, session: string): Promise<boolean> {

	const payload = {
		action: 'getPossibleNewGameworlds',
		controller: 'gameworld',
		params: {},
		session
	};

	try {
		const response = await axios.post(lobby_endpoint, payload);
		return !response.data.error;
	} catch { return false; }
}

async function test_gameworld_connection(axios: AxiosInstance, gameworld: string, session: string): Promise<boolean> {

	const payload = {
		action: 'get',
		controller: 'cache',
		params: {
			names: ['Player:']
		},
		session
	};

	try {
		const response = await axios.post(`https://${gameworld}.kingdoms.com/api/?c=cache&a=get&t${Date.now()}`, payload);
		return !response.data.error;
	} catch { return false; }
}

export default manage_login;
