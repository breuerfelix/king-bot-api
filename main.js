import kingbot from './src';

const gameworld = 'COM5';
const email = 'tmfoltz@gmail.com';
const password = 'Swimming168';
const port = 3000;

async function main(){
	kingbot.start_server(gameworld, email, password, port);
}

if(process.argv[2] == '--gui') kingbot.start_server(gameworld, email, password, port);
else main();

export {};
