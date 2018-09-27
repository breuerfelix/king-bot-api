import axios from 'axios';
import fs from 'fs';
import qs from 'qs';
import cheerio from 'cheerio';
const ci = cheerio;

axios.defaults.withCredentials = true;
axios.defaults.crossDomain = true;
//axios.defaults.maxRedirects = 0;
axios.defaults.validateStatus = function(status){ return status >= 200 && status < 303; };

const gameworld = 'com2';

var msid;
var token;
var sessionID;

async function main() {
	await login();
	// client is logged in
	// test request
	let post_data = {"controller":"player","action":"getOpenChatWindows","params":{},"session":sessionID};
	let data = await axios.post(`https://com2.kingdoms.com/api/?c=player&a=getOpenChatWindows&t${Date.now()}`, post_data);

	console.log(data.data);
}

async function login(){
	// gets msid
	let { data } = await axios.get('https://mellon-t5.traviangames.com/authentication/login/ajax/form-validate?');
	let $ = ci.load(data);
	let html = $.html();

	let startIndex = html.indexOf('msid');
	let endIndex = html.indexOf('{}', startIndex);
	msid = html.substring(startIndex, endIndex);

	msid = msid.substring(msid.indexOf(',') + 3, msid.lastIndexOf('"'));
	console.log('msid: ' + msid);
	
	// logs in with credentials from file
	var url = `https://mellon-t5.traviangames.com/authentication/login/ajax/form-validate?msid=${msid}&msname=msid`;
	var options = {
		method: 'POST',
		headers: { 'content-type': 'application/x-www-form-urlencoded' },
		data: qs.stringify(read_credentials()),
		url,
	};
	
	// gets token
	let res = await axios(options);

	let rv = parse_token(res.data);
	let tokenURL = rv.url;
	token = rv.token;
	console.log('token: ' + token);

	options = {
		method: 'GET',
		url: tokenURL,
		maxRedirects: 0,
	};

	let cookies = await axios(options);
	options.url = cookies.headers.location;	
	cookies = await axios(options);

	// set lobby cookies
	axios.defaults.headers['Cookie'] = parse_cookies(cookies.headers['set-cookie'].slice(2));

	let sessionLink = cookies.headers.location;
	sessionID = sessionLink.substring(sessionLink.lastIndexOf('=') + 1);
	console.log('sessionID: ' + sessionID);
	
	let lastLobbyURL = 'https://lobby.kingdoms.com/' + sessionLink;
	await axios.get(lastLobbyURL);

	// get gameworld token
	let mellonURL = `https://mellon-t5.traviangames.com/game-world/join/gameWorldId/698?msname=msid&msid=${msid}`;
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
	};
	res = await axios(options);
	
	// set gameworld cookies
	axios.defaults.headers['Cookie'] += parse_cookies(res.headers['set-cookie']);

	// get new sessionID
	sessionLink = res.headers.location;
	sessionID = sessionLink.substring(sessionLink.lastIndexOf('=') + 1);
	console.log('new sessionID: ' + sessionID);
	
	let gameworldURL = `https://${gameworld}.kingdoms.com/` + sessionLink;
	await axios.get(gameworldURL);
}

function parse_token(raw_html){
	let $ = ci.load(raw_html);

	let html = $.html();
	let urlIndex = html.indexOf('url:');
	let urlEndIndex = html.indexOf('}', urlIndex);

	let tokenURL = html.substring(urlIndex, urlEndIndex);
	tokenURL = tokenURL.substring(tokenURL.indexOf('\'') + 1, tokenURL.lastIndexOf('\''));
	let token = tokenURL.substring(tokenURL.indexOf('token=') + 'token='.length, tokenURL.indexOf('&', tokenURL.indexOf('token')));

	let obj = { url: tokenURL, token };
	return obj;
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
		

function read_credentials(){
	let cred = fs.readFileSync('./cred.txt', 'utf-8');
	console.log(cred);
	cred = cred.trim().split(';');
	return { email: cred[0], password: cred[1] };
}

main();

export {};
