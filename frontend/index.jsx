import 'bulma';
import { h, render, Component } from 'preact';

import Router from 'preact-router';
import Home from './sites/home';
import Login from './sites/login';

class App extends Component {
	render() {
		return (
			<div class='container'>
				<Router>
					<Home path='/' />
					<Login path='/login' />
				</Router>
			</div>
		);
	}
}

// render an instance of Clock into <body>:
render(<App />, document.body);

