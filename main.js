import kingbot from './dist';

const gameworld = 'com5';
const email = '';
const password = '';

async function main(){
	await kingbot.login(gameworld, email, password);
	await kingbot.init_data();

	// place bot action below
	kingbot.start_farming(['test'], 'test', 100);
	kingbot.upgrade_resources({ clay: 10, wood: 5 }, '-01-');
	kingbot.upgrade_resources({ clay: 10, iron: 5 }, '-02-');
	kingbot.upgrade_resources({ crop: 10, wood: 5 }, '-03-');
}

main();

export {};

