// import material lite design
import 'material-design-lite/material.min.css';
import 'material-design-lite/material.min.js';

import { h, render, Component } from 'preact';

import Router from 'preact-router';
import Home from './sites/home';
import Login from './sites/login';

class App extends Component {
	render() {
		let time = new Date().toLocaleTimeString();
		return (
			<Router>
				<Home path='/' />
				<Login path='/login' />
			</Router>
		);
	}
}

// render an instance of Clock into <body>:
render(<App />, document.body);

