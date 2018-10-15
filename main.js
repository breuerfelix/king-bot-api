import kingbot from './dist';

const gameworld = '';
const email = '';
const password = '';

async function main(){
	await kingbot.login(gameworld, email, password);
	await kingbot.init_data();

	// place bot action below
}

main();

export {};

