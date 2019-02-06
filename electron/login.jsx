import { h, render, Component } from 'preact';
import classNames from 'classnames';

class Login extends Component {
	state = {
		gameworld: '',
		email: '',
		password: '',
		ingameName: '',

		errorGameworld: false,
		errorEmail: false,
		errorPassword: false,

		loadingLogin: false,
		loadingStart: false
	}

	start = _ => {
		alert('if the app shuts down you might have enterd wrong credentials. you should restart and login again.');

		this.setState({ loadingStart: true });

		fetch('/api/start', {
			method: 'GET'
		});
	}

	submit = _ => {
		const { gameworld, email, password, ingameName } = this.state;

		this.setState({
			errorGameworld: !gameworld,
			errorEmail: !email,
			errorPassword: !password
		});

		const { errorGameworld, errorEmail, errorPassword } = this.state;

		if (errorGameworld || errorEmail || errorPassword) return;

		this.setState({ loadingLogin: true });

		fetch('/api/login', {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				gameworld,
				email,
				password,
				ingameName
			})
		});
	}

	render(props, {
		gameworld,
		email,
		password,
		ingameName,
		errorGameworld,
		errorEmail,
		errorPassword,
		loadingLogin,
		loadingStart
	}) {

		const gameworldClass = classNames({
			'input': true,
			'is-radiusless': true,
			'is-danger': errorGameworld
		});

		const emailClass = classNames({
			'input': true,
			'is-radiusless': true,
			'is-danger': errorEmail
		});

		const passwordClass = classNames({
			'input': true,
			'is-radiusless': true,
			'is-danger': errorPassword
		});

		const loginClass = classNames({
			'button': true,
			'is-radiusless': true,
			'is-success': true,
			'is-loading': loadingLogin

		});

		const startClass = classNames({
			'button': true,
			'is-radiusless': true,
			'is-success': true,
			'is-loading': loadingStart
		});

		return (
			<div class="container">
				<div class="columns is-centered">
					<div className="column is-half">
						<div style='margin-top: 30px;' class="box is-radiusless">
							<article class="media">
								<div class="media-content">
									<div class="content">
										<strong>login</strong>
										<br />
										<br />

										<Input
											label='gameworld'
											placeholder='com1'
											value={ gameworld }
											onChange={ e => this.setState({ gameworld: e.target.value }) }
											classes={ gameworldClass }
										/>

										<Input
											label='email'
											placeholder='fairplay@gmail.com'
											value={ email }
											onChange={ e => this.setState({ email: e.target.value }) }
											classes={ emailClass }
										/>

										<Input
											label='password'
											placeholder='topsecret123'
											type='password'
											value={ password }
											onChange={ e => this.setState({ password: e.target.value }) }
											classes={ passwordClass }
										/>

										<br />
										<strong>sitter / dual ?</strong><i style='padding-left: 10px'>(optional)</i>

										<br />
										<small>if you play as a sitter or dual we need the ingame nick to identify the correct gameworld id</small>
										<br />
										<br />

										<Input
											label='ingame name'
											placeholder='IrockThisServer'
											value={ ingameName }
											onChange={ e => this.setState({ ingameName: e.target.value }) }
										/>

										<br />
										<div className="control">
											<button class={ loginClass } onClick={ this.submit }>
												login
											</button>
											<button class={ startClass } onClick={ this.start } style='margin-left: 1rem'>
												start bot based on last login
											</button>
										</div>

									</div>
								</div>
							</article>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

const Input = ({
	label,
	placeholder,
	onChange,
	classes = 'input is-radiusless',
	type = 'text'
}) => (

	<div class="field">
		<label class="label">{ label }</label>
		<div class="control">
			<input
				class={ classes }
				type={ type }
				placeholder={ placeholder }
				onChange={ onChange }
			/>
		</div>
	</div>
);

export default Login;
