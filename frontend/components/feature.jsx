import { h, render, Component } from 'preact';
import { route } from 'preact-router';
import classNames from 'classnames';
import axios from 'axios';
import { connect } from 'unistore/preact';
import actions from '../actions';
import lang, { storeKeys } from '../language';

const statusDict = {
	'error': 'fa-exclamation',
	'loading': 'fa-spinner fa-pulse',
	'offline': 'fa-pause',
	'online': 'fa-check',
};

const rowStyle = {
	verticalAlign: 'middle',
	textAlign: 'center',
};

@connect(`notifications,${storeKeys}`, actions)
export default class Feature extends Component {
	state = {
		ident: 'null',
		name: 'feature_name',
		description: 'description',
		run: false,
		error: false,
		// error, loading, offline, online
		status: 'offline'
	}

	interval = null;

	constructor(props) {
		super(props);

		let status = props.feature.run ? 'online' : 'offline';

		if (this.state.error) status = 'error';

		this.setState({
			status,
			...props.feature,
		});
	}

	// refresh feature status
	async update() {
		const { uuid, ident } = this.state;

		const payload = {
			action: 'get',
			feature: {
				ident,
				uuid,
			},
		};

		const res = await axios.post('/api/feature', payload);

		const { error, message, data } = res.data;

		if (error) {
			this.props.add_notification(message, 'error');
			return;
		}

		this.setState({ ...data });
	}

	async toggle() {
		const payload = {
			action: this.state.run ? 'stop' : 'start',
			feature: this.state,
		};

		this.setState({
			run: !this.state.run,
			status: 'loading',
		});

		const res = await axios.post('/api/feature', payload);

		const { data, error, message } = res.data;

		if (error) {
			this.props.add_notification(message, 'error');
			this.setState({
				status: 'error',
				run: false,
			});

			return;
		}

		this.setState({
			status: message,
			run: (message == 'online'),
		});
	}

	edit() {
		const { ident, uuid } = this.state;
		route(`/edit_feature/${ ident }/${ uuid }`);
	}

	render() {
		var toggle_icon = classNames({
			fas: true,
			'fa-lg': true,
			'fa-toggle-on': this.state.run,
			'fa-toggle-off': !this.state.run,
		});

		// TODO translate description
		return (
			<tr>
				<td style={ rowStyle }>
					{this.props[`lang_feature_${this.state.ident}`]}
				</td>
				<td style={ rowStyle }>
					{this.state.description}
				</td>
				<td style={ rowStyle }>
					<span class='icon is-large'>
						<i class={ 'fas fa-lg ' + statusDict[this.state.status] }></i>
					</span>
				</td>
				<td style={ rowStyle }>
					<a class='has-text-black' onClick={ this.toggle.bind(this) }>
						<span class='icon is-medium'>
							<i class={ toggle_icon }></i>
						</span>
					</a>
				</td>
				<td style={ rowStyle }>
					<a class='has-text-black' onClick={ this.edit.bind(this) }>
						<span class='icon is-medium'>
							<i class='fas fa-lg fa-edit'></i>
						</span>
					</a>
				</td>
			</tr>

		);
	}
}
