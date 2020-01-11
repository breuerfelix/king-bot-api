import { h, render, Component } from 'preact';

import Router from 'preact-router';

import { Provider, connect } from 'unistore/preact';
import createStore from 'unistore';
import axios from 'axios';

import NavBar from './navbar';
import Notifications from './components/notifications';
import Login from './sites/login';
import EditFeature from './sites/edit_feature';
import EasyScout from './extras/easy_scout';
import FeatureList from './sites/feature_list';
import InactiveFinder from './sites/inactive_finder';
import Logger from './sites/logger';
import lang, { languages } from './language';

const store = createStore({ notifications: [], ...languages.en });
lang.store = store;

// get stored language from server
axios.get('/api/data?ident=language')
	.then(({ data }) => lang.changeLanguage(data.language, false));

const App = () => (
	<div>
		<NavBar />
		<div className='columns is-centered'>
			<div className='column is-two-thirds'>
				<Notifications />
				<div style={{ marginTop: '1rem' }}>
					<Router>
						<FeatureList default path='/' />
						<Login path='/login' />
						<EditFeature path='/edit_feature/:ident/:uuid' />
						<EasyScout path='/easy_scout' />
						<InactiveFinder path='/inactive_finder' />
						<Logger path='/logger' />
					</Router>
				</div>
			</div>
		</div>
	</div>
);

render(
	<Provider store={ store }>
		<App />
	</Provider>
	, document.body);
