var express = require('express');
var bodyParser = require('body-parser');
var kingbot = require('../dist');
var api = require('../dist/api');

const port = 3030;

var app = express();

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

// respond with "hello world" when a GET request is made to the homepage
app.get('*', function (req, res) {
	res.send('king-bot-api development server runnind here !');
});

app.post('/api/', function(req, res) {
	var payload = req.body;
	var url = req.url;
	// substring the /api prefix
	url = url.substring(4);

	var { token, session, msid } = api.default;
	
	payload.session = session;

	api.default.post(url, payload).then(function(response) { res.send(response.data); }).catch(function(err){ res.send(err); });
});

kingbot.default.login('com5').then(() => {
	app.listen(port, () => console.log(`dev server listen on port: ${port}!`));
});
