import { h, render, Component } from 'preact';
import classNames from 'classnames';
import Icon from './icon';

export default class Feature extends Component {
	state = {
		name: this.props.name,
		status: 'stopped',
		description: 'village -01-',
		running: true
	}
	constructor(props) {
		super(props);
		console.log(this.props);
	}

	toggle_feature = (e) => {
		this.setState({
			running: !this.state.running
		});
	}

	render() {
		var toggle_feature = classNames({
			fas: true,
			'fa-toggle-on': this.state.running,
			'fa-toggle-off': !this.state.running
		});
		return (
			<div class="level has-background-white-ter">
				<div className="level-item" style='padding: 1rem'>
					<div className="content">
						{ this.state.name }
					</div>
				</div>
				<div className="level-item">
					{ this.state.description }
				</div>
				<div className="level-item" >
					{ this.state.status }
				</div>
				<div className="level-item">
					<a class="button is-light is-medium" onClick={ this.toggle_feature }>
						<span class="icon">
							<i class={ toggle_feature }></i>
						</span>
					</a>
				</div>
				<div className="level-item">
					<a class="button is-light">
						<span class="icon">
							<i class="fas fa-edit"></i>
						</span>
					</a>
				</div>
			</div>
		);
	}
}
