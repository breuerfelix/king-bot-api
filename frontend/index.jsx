// import styles
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bulma';
import 'bulma-extensions';

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

render(<App />, document.body);
