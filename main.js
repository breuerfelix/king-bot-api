var kingbot = require('./dist').default;

var gameworld = '';
var email = '';
var password = '';
// only change if needed
var sitter_type = ''; // 'sitter' or 'dual'
var sitter_name = ''; // ingame avatar name
var port = 3000;
var proxy = null;

kingbot.start_server(gameworld, email, password, sitter_type, sitter_name, port, proxy);
