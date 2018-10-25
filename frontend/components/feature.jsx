import { h, render, Component } from 'preact';
import classNames from 'classnames';
import axios from 'axios';

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
		running: false,
		// error, loading, offline, online
		status: 'offline'
	}

	constructor(props) {
		super(props);

		const { ident, name, description, run } = this.props.feature;
		const status = run ? 'online' : 'offline';

		this.setState({
			ident,
			name,
			description,
			running: run,
			status 
		});
	}

	toggle = async (e) => {
		const payload = {
			action: this.state.running ? 'stop' : 'start',
			feature: this.props.feature
		};

		this.setState({
			running: !this.state.running,
			status: 'loading'
		});

		const res = await axios.post('/api/feature', payload);

		if(res.status == 200) {
			this.setState({
				status: res.data,
				running: (res.data == 'online')
			});
		} else {
			this.setState({
				status: 'error',
				running: false
			});
		}
	}

	edit = (e) => {
		// pass this.props.feature -> full response from server

	}

	render() {
		var toggle_icon = classNames({
			fas: true,
			'fa-lg': true,
			'fa-toggle-on': this.state.running,
			'fa-toggle-off': !this.state.running
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
