import { h, render, Component } from 'preact';
import classNames from 'classnames';

class NavBar extends Component {
	state = {
		burger: false
	}

	show_burger = (e) => {
		this.setState({
			burger: !this.state.burger
		});
	}

	render() {
		const burger_class = classNames({
			'navbar-burger': true,
			'burger': true,
			'is-active': this.state.burger
		});

		const menue_class = classNames({
			'navbar-menu': true,
			'is-active': this.state.burger
		});

		return (
			<nav class="navbar has-background-light" style="margin-bottom: 2rem">
				<div class="container">
					<div class="navbar-brand">
						<a class="navbar-item" href="https://github.com/scriptworld-git/king-bot-api">
							king-bot-api
						</a>
						<a role="button" onClick={ this.show_burger } class={ burger_class } aria-label="menu" aria-expanded="false">
							<span aria-hidden="true"></span>
							<span aria-hidden="true"></span>
							<span aria-hidden="true"></span>
						</a>
					</div>
					<div class={ menue_class }>
						<div class="navbar-start">
							<a class="navbar-item" href="/">
								home
							</a>

							<a class="navbar-item" href="https://github.com/scriptworld-git/king-bot-api/blob/master/README.md">
								documentation
							</a>
						</div>
						<div class="navbar-end">
							<a class="navbar-item" href="https://ko-fi.com/Y8Y6KZHJ">
								donate
							</a>
						</div>
					</div>
				</div>
			</nav>
		);
	}
}

export default NavBar;
