// import styles
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bulma';
import 'bulma-extensions';

import { h, render, Component } from 'preact';

import Router from 'preact-router';

import { Provider } from 'unistore/preact';
import createStore from 'unistore';

import NavBar from './navbar';
import Notifications from './components/notifications';
import Login from './sites/login';
import EditFeature from './sites/edit_feature';
import EasyScout from './extras/easy_scout';
import FeatureList from './sites/feature_list';

const store = createStore({ edit_feature: {}, notifications: [] });

class App extends Component {
	render() {
		return (
			<div>
				<NavBar />
				<div className="columns is-centered">
					<div className="column is-two-thirds">
						<Notifications />
						<div style='margin-top: 1rem'>
							<Router>
								<FeatureList path='/' />
								<Login path='/login' />
								<EditFeature path='/edit_feature' />
								<EasyScout path='/easy_scout' />
							</Router>
						</div>
					</div>
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
