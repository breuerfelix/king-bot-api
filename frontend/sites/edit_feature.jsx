import { h, render, Component } from 'preact';
import { route } from 'preact-router';
import axios from 'axios';
import uniqid from 'uniqid';
import { connect } from 'unistore/preact';

import features from '../features';

const actions = store => ({
	add_notification(state, message, level) {
		const noti = {
			id: uniqid.time(),
			message,
			level
		};

		return { notifications: [...state.notifications, noti] };
	}
});

@connect('notifications', actions)
export default class EditFeature extends Component {
	state = {
		ident: '',
		show_tips: false
	}

	componentWillMount() {
		const { ident, uuid } = this.props;

		if (!ident || !uuid) {
			this.props.add_notification('provide ident and uuid for feature to edit !', 'error');
			route('/');
			return;
		}

		const payload = {
			action: 'get',
			feature: {
				ident,
				uuid
			}
		};

		axios.post('/api/feature', payload).then(res => {
			const { error, message, data } = res.data;

			if (error) {
				this.props.add_notification(message, 'error');
				return;
			}

			this.setState({
				...data
			});
		});
	}

	submit = async feature => {
		const { uuid, ident } = this.state;
		const payload = {
			action: 'update',
			feature: { uuid, ident, ...feature }
		};

		this.send_request(payload);
	}

	delete = async feature => {
		const { uuid, ident } = this.state;
		const payload = {
			action: 'delete',
			feature: { ident, uuid, ...feature }
		};

		this.send_request(payload);
	}

	send_request = async payload => {
		const response = await axios.post('/api/feature', payload);

		const { error, message, data } = response.data;

		if (error) {
			this.props.add_notification(message, 'error');
			return;
		}

		route('/');
	}

	render({ add_notification }, { ident, name, long_description }) {
		if (!ident) return;

		const featureProps = {
			feature: this.state,
			submit: this.submit,
			delete: this.delete,
		};

		const feature = h(features[ident].component, featureProps);

		return (
			<div>
				<h1 className='subtitle is-4' style='margin-bottom: 2rem' align='center'>{name}
					{long_description &&
						<a class='has-text-black' onClick={ e => add_notification(long_description, 'info') }>
							<span class='icon is-large'>
								<i class='fas fa-info'></i>
							</span>
						</a>
					}
				</h1>
				{feature}
			</div>
		);
	}
}
