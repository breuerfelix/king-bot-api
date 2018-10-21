import { h, render, Component } from 'preact';

class Login extends Component {
	render() {
		return (
			<div class="mdl-grid">
				<div class="mdl-layout-spacer"></div>
				<div class="mdl-cell mdl-cell--4-col">
					This div is centered
					<button class="mdl-button mdl-js-button mdl-button--raised">
						Button
					</button>
				</div>
				<div class="mdl-layout-spacer"></div>
			</div>
		);
	}
}

export default Login;
