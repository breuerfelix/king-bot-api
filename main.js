import kingbot from './src';

const gameworld = '';
const email = '';
const password = '';
const port = 3000;

async function main(){
	await kingbot.login(gameworld, email, password);

	// place bot action below
}

async function scout() {
	await kingbot.login(gameworld, email, password);

	// farmlists which should be send when using npm run scout
}

if(process.argv[2] == '--scout') scout();
else if(process.argv[2] == '--gui') kingbot.start_server(gameworld, email, password, port);
else main();

export {};

