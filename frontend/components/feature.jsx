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
			name: 'est'
		});
	}

	render() {
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
				<div className="level-item" onClick={ this.toggle_feature }>
					{ this.state.status }
				</div>
				<div className="level-item">
					<Icon />
				</div>
			</div>
		);
	}
}
