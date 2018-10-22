import { h, render, Component } from 'preact';

export default class Icon extends Component {
	constructor(props) {
		super(props);
		console.log(this.props);
	}

	render() {
		return (
			<span class="icon">
				<span class="fas fa-toggle-on"></span>
			</span>
		);
	}
}
