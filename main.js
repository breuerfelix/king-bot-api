var kingbot = require('./dist').default;

var gameworld = '';
var email = '';
var password = '';
var port = 3000;

function main() {
	kingbot.start_server(gameworld, email, password, port);
}

if (process.argv[2] == '--gui') kingbot.start_server(gameworld, email, password, port);
else main();
