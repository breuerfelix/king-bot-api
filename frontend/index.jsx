// import styles
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bulma';
import 'bulma-extensions';

import { h, render, Component } from 'preact';

import Router from 'preact-router';
import Home from './sites/home';
import Login from './sites/login';
import EditFeature from './sites/edit_feature';
import NavBar from './navbar';

class App extends Component {
	render() {
		return (
			<div>
				<NavBar />
				<Router>
					<Home path='/' />
					<Login path='/login' />
					<EditFeature path='/editFeature' />
				</Router>
			</div>
		);
	}
}

render(<App />, document.body);
