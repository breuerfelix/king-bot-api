import fs from 'fs';

function read_credentials(){
	let cred = fs.readFileSync('./cred.txt', 'utf-8');
	console.log(cred);
	cred = cred.trim().split(';');
	return { email: cred[0], password: cred[1] };
}

export default read_credentials;
