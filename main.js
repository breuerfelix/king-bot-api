import kingbot from './src';

async function main(){
	await kingbot.login('com2');
	await kingbot.test();
}

main();

export {};
