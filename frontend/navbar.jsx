import { h, render, Component } from 'preact';
import classNames from 'classnames';
import axios from 'axios';
import { route } from 'preact-router';
import uniqid from 'uniqid';
import { connect } from 'unistore/preact';

import features from './features';
import lang, { storeKeys } from './language';

const actions = store => ({
	add_notification(state, message, level) {
		const noti = {
			id: uniqid.time(),
			message,
			level,
		};

		return { notifications: [...state.notifications, noti] };
	}
});

@connect('notifications,' + storeKeys, actions)
export default class NavBar extends Component {
	navbarFeatures = [];
	state = {
		burger: false
	};

	componentWillMount() {
		this.availableLanguages = lang.availableLanguages.map(x =>
			<a className='navbar-item' onClick={ () => lang.changeLanguage(x) }>{x}</a>
		);
	}

	show_burger = e => {
		this.setState({
			burger: !this.state.burger,
		});
	}

	get_new = async ident => {
		this.setState({ burger: false });

		const payload = {
			action: 'new',
			feature: { ident },
		};

		const res = await axios.post('/api/feature', payload);

		const { error, message, data } = res.data;

		if (error) {
			this.props.add_notification(message, 'error');
			return;
		}

		const { uuid } = data;

		route(`/edit_feature/${ident}/${uuid}`);
	}

	route = name => {
		this.setState({ burger: false });
		route(name);
	}

	render() {
		this.navbarFeatures = Object.keys(features).filter(x => features[x].navbar)
			.map(feature =>
				h(
					'a',
					{ className: 'navbar-item', onClick: () => this.get_new(feature) },
					this.props['lang_navbar_' + feature],
				)
			);

		const burger_class = classNames({
			'navbar-burger': true,
			'burger': true,
			'is-active': this.state.burger,
		});

		const menue_class = classNames({
			'navbar-menu': true,
			'is-active': this.state.burger,
		});

		return (
			<nav class="navbar is-light is-fixed-top">
				<div class="container">
					<div class="navbar-brand">
						<a class="navbar-item" target="_blank" href="https://github.com/breuerfelix/king-bot-api">
							{this.props.lang_navbar_king_bot_api}
						</a>
						<a role="button" onClick={ this.show_burger } class={ burger_class } aria-label="menu" aria-expanded="false">
							<span aria-hidden="true"></span>
							<span aria-hidden="true"></span>
							<span aria-hidden="true"></span>
						</a>
					</div>
					<div class={ menue_class }>
						<div class="navbar-start">
							<a class="navbar-item" onClick={ e => this.route('/') }>
								{this.props.lang_navbar_home}
							</a>

							<div class="navbar-item has-dropdown is-hoverable">
								<a class="navbar-link is-arrowless">
									{this.props.lang_navbar_add_feature}
								</a>

								<div class='navbar-dropdown is-radiusless'>
									{this.navbarFeatures}
								</div>
							</div>

							<div class='navbar-item has-dropdown is-hoverable'>
								<a class='navbar-link is-arrowless'>
									{this.props.lang_navbar_extras}
								</a>

								<div class="navbar-dropdown is-radiusless">
									<a className="navbar-item" onClick={ e => this.route('/easy_scout') }>
										{this.props.lang_navbar_easy_scout}
									</a>
									<a className="navbar-item" onClick={ e => this.route('/inactive_finder') }>
										{this.props.lang_navbar_inactive_finder}
									</a>
									<a className="navbar-item" onClick={ e => this.route('/logger') }>
										{this.props.lang_navbar_logger}
									</a>
									<a className="navbar-item" onClick={ e => this.route('/login') }>
										{this.props.lang_navbar_change_login}
									</a>
								</div>
							</div>

						</div>
						<div class="navbar-end">

							<div class="navbar-item has-dropdown is-hoverable">
								<a class="navbar-link is-arrowless">
									{this.props.lang_navbar_language}
								</a>

								<div class='navbar-dropdown is-radiusless'>
									{this.availableLanguages}
								</div>
							</div>

							<div class="navbar-item has-dropdown is-hoverable">
								<a class="navbar-link is-arrowless">
									{this.props.lang_navbar_links}
								</a>

								<div class='navbar-dropdown is-radiusless'>
									<a className='navbar-item' target='__blank' href='http://kingbot.felixbreuer.me'>
										{this.props.lang_navbar_landing_page}
									</a>
									<a className='navbar-item' target='__blank' href='http://github.com/breuerfelix/king-bot-api'>
										{this.props.lang_navbar_github}
									</a>
									<a className='navbar-item' target='__blank' href='http://github.com/breuerfelix/king-bot-api/issues'>
										{this.props.lang_navbar_report_bug}
									</a>
									<a className='navbar-item' target='__blank' href='http://github.com/breuerfelix/king-bot-api/releases'>
										{this.props.lang_navbar_releases}
									</a>
									<a className='navbar-item' target='__blank' href='http://breuer.dev'>
										{this.props.lang_navbar_felixbreuer}
									</a>
								</div>
							</div>

							<a class='navbar-item' target='_blank' href='https://ko-fi.com/Y8Y6KZHJ'>
								{this.props.lang_navbar_donate}
							</a>
						</div>
					</div>
				</div>
			</nav>
		);
	}
}
