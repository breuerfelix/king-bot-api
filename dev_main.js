import kingbot from './src';

const gameworld = '';
const email = '';
const password = '';
// only change if needed
const sitter_type = ''; // 'sitter' or 'dual'
const sitter_name = ''; // ingame avatar name
const port = 3000;
const proxy = null; // proxy as string ''

kingbot.start_server(gameworld, email, password, sitter_type, sitter_name, port, proxy);
