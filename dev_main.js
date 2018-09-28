import kingbot from './dist';

async function main(){
	console.log('development mode active');
	await kingbot.test();
}

main();

export {};
