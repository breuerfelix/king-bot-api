const kingbot = require('./dist').default;
const settings = require('./dist/settings').default;

const { app, BrowserWindow } = require('electron');
const path = require('path');
const express = require('express');

let server = express();
let port = 3001;
let running_server;

let win;

server.use(express.json());

server.use(express.static(path.resolve(__dirname, './electron-dist')));

server.post('/api/login', (req, res) => {
	const { gameworld, email, password, ingameName } = req.body;

	running_server.close();

	settings.write_credentials(gameworld, email, password, ingameName);
	kingbot.start_server().then(() => {
		win.loadURL('http://localhost:3000');
	});

});

server.get('/api/start', (req, res) => {
	running_server.close();
	kingbot.start_server().then(() => {
		win.loadURL('http://localhost:3000');
	});
});

server.get('*', (req, res) => {
	res.sendFile(path.resolve(__dirname, './electron-dist', 'index.html'));
});

// start login server
running_server = server.listen(port, () => console.log(`login server listening on port ${port}!`));
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.

function createWindow () {

	// Create the browser window.
	win = new BrowserWindow({ width: 1200, height: 800 });

	// and load the index.html of the app.
	win.loadURL('http://localhost:3001');

	// Emitted when the window is closed.
	win.on('closed', () => {
		// Dereference the window object, usually you would store windows
		// in an array if your app supports multi windows, this is the time
		// when you should delete the corresponding element.
		running_server.close();

		server = null;
		port = null;
		running_server = null;
		win = null;

		process.exit();
	});
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);
