import { h, render, Component } from 'preact';
import { route } from 'preact-router';
import classNames from 'classnames';
import axios from 'axios';
import { connect } from 'unistore/preact';

const actions = store => ({
	change_feature_to_edit(state, feature) {
		return { edit_feature: { ...feature } };
	}
});

@connect('', actions)
export default class Feature extends Component {
	status_dict = {
		'error': 'fa-exclamation',
		'loading': 'fa-spinner',
		'offline': 'fa-pause',
		'online': 'fa-check'
	}

	state = {
		ident: 'null',
		name: 'feature_name',
		description: 'description',
		run: false,
		// error, loading, offline, online
		status: 'offline'
	}

	constructor(props) {
		super(props);

		const status = props.feature.run ? 'online' : 'offline';

		this.setState({
			status,
			...props.feature
		});
	}

	toggle = async (e) => {
		const payload = {
			action: this.state.run ? 'stop' : 'start',
			feature: this.state
		};

		this.setState({
			run: !this.state.run,
			status: 'loading'
		});

		const res = await axios.post('/api/feature', payload);

		if(res.status == 200) {
			this.setState({
				status: res.data,
				run: (res.data == 'online')
			});
		} else {
			this.setState({
				status: 'error',
				run: false
			});
		}
	}

	edit = (e) => {
		this.props.change_feature_to_edit(this.state);
		route('/edit_feature');
	}

	render() {
		var toggle_icon = classNames({
			fas: true,
			'fa-lg': true,
			'fa-toggle-on': this.state.run,
			'fa-toggle-off': !this.state.run
		});

		const row_style = {
			verticalAlign: 'middle',
			textAlign: 'center'
		};

		return (
			<tr class="">
				<td style={ row_style }>
					{ this.state.name }
				</td>
				<td style={ row_style }>
					{ this.state.description }
				</td>
				<td style={ row_style }>
					<span class="icon is-large">
						<i class={ 'fas fa-lg ' + this.status_dict[this.state.status] }></i>
					</span>
				</td>
				<td style={ row_style }>
					<a class="button is-white" onClick={ this.toggle }>
						<span class="icon is-medium">
							<i class={ toggle_icon }></i>
						</span>
					</a>
				</td>
				<td style={ row_style }>
					<a class="button is-white" onClick={ this.edit }>
						<span class="icon is-medium">
							<i class="fas fa-lg fa-edit"></i>
						</span>
					</a>
				</td>
			</tr>
		);
	}
}
