import { h, render, Component } from 'preact';
import { route } from 'preact-router';
import classNames from 'classnames';


export default class Adventure extends Component {
	state = {
		name: 'auto adventure',
		type: 0,
		min_health: '',
		error_input: false
	}

	componentWillMount() {
		this.setState({
			...this.props.feature
		});
	}

	submit = async (e) => {
		this.setState({ error_input: (this.state.min_health == '') });

		if (this.state.error_input) return;

		this.props.submit({ ...this.state });
	}

	render() {
		const { name, type, min_health } = this.state;
		const input_class = classNames({
			input: true,
			'is-danger': this.state.error_input
		});

		return (
			<div>
				<div className="columns">

					<div className="column">

						<div class="field">
							<label class="label">adventure type</label>
							<div class="control">
								<div class="select">
									<select
										value={type}
										onChange={(e) => this.setState({ type: e.target.value })}
									>
										<option value='0'>short</option>
										<option value='1'>long</option>
									</select>
								</div>
							</div>
						</div>

					</div>

					<div className="column">
						<label class="label">minimum health</label>
						<div class="field has-addons">
							<p class="control">
								<a class="button is-static">
									min
								</a>
							</p>
							<div class="control">
								<input
									class={input_class}
									type="text"
									value={min_health}
									placeholder="health"
									onChange={(e) => this.setState({ min_health: e.target.value })}
								/>
							</div>
							<p class="control">
								<a class="button is-static">
									%
								</a>
							</p>
						</div>
						<p class="help">provide a number</p>
					</div>

				</div>

				<div className="columns">
					<div className="column">
						<button className="button is-success" onClick={this.submit} style='margin-right: 1rem'>
							submit
						</button>
						<button className="button" onClick={(e) => route('/', true)}>
							cancel
						</button>
					</div>
					<div className="column">
					</div>
				</div>

			</div>
		);
	}
}
