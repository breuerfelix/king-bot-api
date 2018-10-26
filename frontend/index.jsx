// import styles
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bulma';
import 'bulma-extensions';

import { h, render, Component } from 'preact';
import { Provider } from 'unistore/preact';

import Router from 'preact-router';
import Home from './sites/home';
import Login from './sites/login';
import EditFeature from './sites/edit_feature';
import NavBar from './navbar';
import EasyScout from './sites/easy_scout';

import createStore from 'unistore';

const store = createStore({ edit_feature: {} });

class App extends Component {
	render() {
		return (
			<div>
				<NavBar />
				<div style='margin-top: 1rem'>
					<Router>
						<Home path='/' />
						<Login path='/login' />
						<EditFeature path='/edit_feature' />
						<EasyScout path='/easy_scout' />
					</Router>
				</div>
			</div>
		);
	}
}

render(
	<Provider store={store}>
		<App />
	</Provider>
	, document.body);
