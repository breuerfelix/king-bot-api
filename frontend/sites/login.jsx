import { h, render, Component } from 'preact';

class Login extends Component {
	render() {
		return (
			<div class="columns is-centered">
				<div className="column is-half">
					<div class="box">
						<article class="media">
							<div class="media-content">
								<div class="content">
									<strong>login</strong>
									<br />
									<br />
									<div class="field">
										<label class="label">gameworld</label>
										<div class="control">
											<input class="input" type="text" placeholder="gameworld" />
										</div>
									</div>

									<div class="field">
										<label class="label">email</label>
										<div class="control">
											<input class="input" type="text" placeholder="email" />
										</div>
									</div>

									<div class="field">
										<label class="label">password</label>
										<div class="control">
											<input class="input" type="text" placeholder="password" />
										</div>
									</div>

									<div className="control">
										<button className="button is-link">
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
	
export default Login;
