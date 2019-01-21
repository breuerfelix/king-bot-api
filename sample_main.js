import kingbot from './src';

const gameworld = 'com1';
const email = 'ilikeyou@gmail.com';
const password = 'verysecret123';
// only change if needed
const sitter_type = ''; // 'sitter' or 'dual'
const sitter_name = ''; // ingame avatar name
const port = 3000;

function main() {
	kingbot.start_server(gameworld, email, password, sitter_type, sitter_name, port);
}

if (process.argv[2] == '--gui') kingbot.start_server(gameworld, email, password, sitter_type, sitter_name, port);
else main();

export {};
