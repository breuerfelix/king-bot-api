import { h, render, Component } from 'preact';

export default class Icon extends Component {
	constructor(props) {
		super(props);
		console.log(this.props);
	}

	render() {
		return (
			<a class="icon">
				<i class="fas fa-toggle-on"></i>
			</a>
		);
	}
}
