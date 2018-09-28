import fs from 'fs';

function read_credentials(){
	let cred: string = fs.readFileSync('./cred.txt', 'utf-8');
	console.log(cred);
	let cred_array: string[] = cred.trim().split(';');
	return { email: cred_array[0], password: cred_array[1] };
}

export default read_credentials;
