import kingbot from './dist';

const gameworld = 'com5';
const email = '';
const password = '';

async function main(){
	await kingbot.login(gameworld, email, password);
	await kingbot.init_data();

	// place bot action below
}

main();

export {};
