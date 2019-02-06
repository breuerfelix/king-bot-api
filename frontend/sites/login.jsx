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
		errorPassword: false
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

		alert('the bot is going to shut down.... restart it, so the changes take effect.');
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
		errorPassword
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

		return (
			<div class="columns is-centered">
				<div className="column is-half">

					<div class="notification is-info">
						this will reset all features you configured!
					</div>

					<div class="box is-radiusless">
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
										<button className="button is-radiusless is-success" onClick={ this.submit }>
											submit
										</button>
									</div>
								</div>
							</div>
						</article>
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
