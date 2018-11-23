import kingbot from './src';

const gameworld = 'com1';
const email = 'ilikeyou@gmail.com';
const password = 'verysecret123';
const port = 3000;

async function main(){
	kingbot.start_server(gameworld, email, password, port);
}

if(process.argv[2] == '--gui') kingbot.start_server(gameworld, email, password, port);
else main();

export {};
