import kingbot from './dist';

const gameworld = 'test';
const email = 'your_email@mail.com';
const password = 'really_save_password';

async function main(){
	await kingbot.login(gameworld, email, password);

	// place bot action below
	kingbot.finish_earlier();

	kingbot.start_farming([ 'Startup farm list', 'rocking farms' ], '-02- Rome', 600);

	kingbot.add_building_queue({ crop: [4, 4, 3], iron: [5] }, '-01-');
	kingbot.add_building_queue({ crop: [6, 5, 5, 4], clay: [5, 4] }, '-01-');
	kingbot.add_building_queue({ clay: [10, 6], wood: [7], iron: [6] }, '-01-');
}

main();

export {};
