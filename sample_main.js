import kingbot from './dist';

const gameworld = 'com5';
const email = 'your_email@mail.com';
const password = 'really_save_password';

async function main(){
	await kingbot.login(gameworld, email, password);
	await kingbot.init_data();

	// place bot action below
	kingbot.start_farming([ 'Startup farm list', 'rocking farms' ], '-02- Rome', 600);
}

main();

export {};
