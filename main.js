import kingbot from './dist';

const gameworld = 'com3';
const email = '';
const password = '';

async function main(){
	await kingbot.login(gameworld, email, password);
	await kingbot.init_data();

	// place bot action below
	//kingbot.start_farming(['test'], 'test', 100);
	kingbot.upgrade_resources({ clay: [10, 5], wood: [5] }, '-01-');
	kingbot.upgrade_resources({ clay: [13, 6], wood: [7] }, '-01-');
}

main();

export {};

