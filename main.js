import kingbot from './src';

const gameworld = '';
const email = '';
const password = '';
const port = 3000;

async function main() {
	kingbot.start_server(gameworld, email, password, port);
}

if (process.argv[2] == '--gui') kingbot.start_server(gameworld, email, password, port);
else main();

export { };
