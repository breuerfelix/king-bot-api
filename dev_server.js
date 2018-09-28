var express = require('express');
var kingbot = require('./dist');
var api = require('./dist/api');
var bodyParser = require('body-parser');

const port = 3030;

var app = express();

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

// respond with "hello world" when a GET request is made to the homepage
app.get('*', function (req, res) {
	console.log(req);
	res.send('hello world');
});

app.post('/api/', function(req, res) {
	var payload = req.body;
	var url = req.url;
	url = url.substring(4);

	var { token, session, msid } = api.default;
	
	payload.session = session;

	api.default.post(url, payload).then(function(response) { res.send(response.data); }).catch(function(err){ res.send(err); });
});

kingbot.default.login('com2').then(() => {
	app.listen(port, () => console.log(`dev server listen on port: ${port}!`));
});
