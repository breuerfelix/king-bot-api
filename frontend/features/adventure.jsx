import { h, render, Component } from 'preact';
import { route } from 'preact-router';
import classNames from 'classnames';
import { connect } from 'unistore/preact';
import { storeKeys } from '../language';


@connect(storeKeys)
export default class Adventure extends Component {
	state = {
		type: 0,
		min_health: '',
		error_input: false,
	}

	componentWillMount() {
		this.setState({ ...this.props.feature });
	}

	async submit() {
		this.setState({ error_input: (this.state.min_health == '') });

		if (this.state.error_input) return;

		this.props.submit({ ...this.state });
	}

	render(props, { type, min_health, error_input }) {
		const input_class = classNames({
			input: true,
			'is-danger': error_input,
		});

		return (
			<div>
				<div className='columns'>

					<div className='column'>

						<div class='field'>
							<label class='label'>
								{props.lang_adventure_adventure_type}
							</label>
							<div class='control'>
								<div class='select'>
									<select
										value={ type }
										onChange={ e => this.setState({ type: e.target.value }) }
										className='is-radiusless'
									>
										<option value='0'>{props.lang_adventure_short}</option>
										<option value='1'>{props.lang_adventure_long}</option>
									</select>
								</div>
							</div>
						</div>

					</div>

					<div className='column'>
						<label class='label'>{props.lang_adventure_min_health}</label>
						<div class='field has-addons'>
							<p class='control'>
								<a class='button is-static is-radiusless'>
									{props.lang_adventure_min}
								</a>
							</p>
							<div class='control'>
								<input
									class={ input_class }
									type='text'
									value={ min_health }
									placeholder={ props.lang_adventure_health }
									onChange={ e => this.setState({ min_health: e.target.value }) }
								/>
							</div>
							<p class='control'>
								<a class='button is-static is-radiusless'>%</a>
							</p>
						</div>
						<p class='help'>{props.lang_adventure_prov_number}</p>
					</div>

				</div>

				<div className='columns'>
					<div className='column'>
						<button
							className='button is-success is-radiusless'
							onClick={ this.submit.bind(this) }
							style={{ marginRight: '1rem' }}
						>
							{props.lang_button_submit}
						</button>
						<button className='button is-radiusless' onClick={ e => route('/', true) }>
							{props.lang_button_cancel}
						</button>
					</div>
					<div className='column'>
					</div>
				</div>

			</div>
		);
	}
}
