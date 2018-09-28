import qs from 'qs';
import cheerio from 'cheerio';
const ci = cheerio;
const lobby_endpoint = 'https://lobby.kingdoms.com/api/index.php';

async function login_to_gameworld(axios, email, password, gameworld){
	let res, options, url, msid, token, session;
	gameworld = gameworld.toLowerCase();

	// get msid
	res = await axios.get('https://mellon-t5.traviangames.com/authentication/login/ajax/form-validate?');
	let $ = ci.load(res.data);
	let html = $.html();

	let startIndex = html.indexOf('msid');
	let endIndex = html.indexOf('{}', startIndex);
	msid = html.substring(startIndex, endIndex);

	msid = msid.substring(msid.indexOf(',') + 3, msid.lastIndexOf('"'));
	console.log('msid: ' + msid);
	
	// logs in with credentials from file
	url = `https://mellon-t5.traviangames.com/authentication/login/ajax/form-validate?msid=${msid}&msname=msid`;

	let credentials = { email, password };

	options = {
		method: 'POST',
		headers: { 'content-type': 'application/x-www-form-urlencoded' },
		data: qs.stringify(credentials),
		url,
	};
	
	// gets token
	res = await axios(options);

	let rv = parse_token(res.data);
	let tokenURL = rv.url;
	token = rv.token;
	console.log('token: ' + token);

	options = {
		method: 'GET',
		url: tokenURL,
		maxRedirects: 0,
		validateStatus: validate_cookie_status,
	};

	let cookies = await axios(options);
	options.url = cookies.headers.location;	
	cookies = await axios(options);

	// set lobby cookies
	axios.defaults.headers['Cookie'] = parse_cookies(cookies.headers['set-cookie'].slice(2));

	let sessionLink = cookies.headers.location;
	session = sessionLink.substring(sessionLink.lastIndexOf('=') + 1);
	console.log('sessionID: ' + session);
	
	let lastLobbyURL = 'https://lobby.kingdoms.com/' + sessionLink;
	await axios.get(lastLobbyURL);

	let gameworldID = await get_gameworld_id(axios, session, gameworld);

	// get gameworld token
	let mellonURL = `https://mellon-t5.traviangames.com/game-world/join/gameWorldId/${gameworldID}?msname=msid&msid=${msid}`;
	res = await axios.get(mellonURL);
	rv = parse_token(res.data);

	token = rv.token;
	console.log('new token: ' + token);

	res = await axios.get(rv.url);

	// get gameworld token
	let worldURL = `https://${gameworld}.kingdoms.com/api/login.php?token=${token}&msid=${msid}&msname=msid`;
	options = {
		method: 'GET',
		url: worldURL,
		maxRedirects: 0,
		validateStatus: validate_cookie_status,
	};

	res = await axios(options);
	
	// set gameworld cookies
	axios.defaults.headers['Cookie'] += parse_cookies(res.headers['set-cookie']);

	// get new sessionID
	sessionLink = res.headers.location;
	session = sessionLink.substring(sessionLink.lastIndexOf('=') + 1);
	console.log('new sessionID: ' + session);
	
	let gameworldURL = `https://${gameworld}.kingdoms.com/` + sessionLink;
	await axios.get(gameworldURL);

	return { msid, session, token };
}

function parse_token(raw_html){
	let $ = ci.load(raw_html);

	let html = $.html();
	let urlIndex = html.indexOf('url:');
	let urlEndIndex = html.indexOf('}', urlIndex);

	let tokenURL = html.substring(urlIndex, urlEndIndex);
	tokenURL = tokenURL.substring(tokenURL.indexOf('\'') + 1, tokenURL.lastIndexOf('\''));
	let token = tokenURL.substring(tokenURL.indexOf('token=') + 'token='.length, tokenURL.indexOf('&', tokenURL.indexOf('token')));

	return { url: tokenURL, token };
}

function parse_cookies(cookie_array){
	let cookie_string = '';
	cookie_array.forEach(x => {
		let uri = x.substring(0, x.indexOf(';') + 2);
		uri = uri.replace(new RegExp('%3A', 'g'), ':');
		uri = uri.replace(new RegExp('%2C', 'g'), ',');
		cookie_string += decodeURI(uri);
	});

	return cookie_string;
}

function validate_cookie_status(status){
	return status >= 200 && status < 303;
}

async function get_gameworld_id(axios, session, gameworld_string){
	const payload = {
		controller: 'player',
		action: 'getAll',
		params: {},
		session
	}

	let res = await axios.post(lobby_endpoint, payload);

	// TODO what if this info isnt cached ? search for name string
	let gameworlds = res.data.cache[5].data.cache;
	let gameworld_id;

	gameworlds.forEach(x => {
		if(x.data.worldName.toLowerCase() === gameworld_string)
			gameworld_id = x.data.consumersId;
	});

	return gameworld_id;
}

export default login_to_gameworld;
