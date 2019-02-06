import { h, render, Component } from 'preact';
import { route } from 'preact-router';
import classNames from 'classnames';
import axios from 'axios';
import Input from '../components/input';

export default class RaiseFields extends Component {
	state = {
		name: 'raise fields',
		all_villages: [],
		village_name: '',
		error_village: false,
		crop: 0,
		wood: 0,
		clay: 0,
		iron: 0
	}

	componentWillMount() {
		this.setState({
			...this.props.feature
		});

		axios.get('/api/data?ident=villages').then(res => this.setState({ all_villages: res.data }));
	}

	submit = async (e) => {
		this.setState({ error_village: (this.state.village_name == '') });

		if (this.state.error_village) return;

		const { ident, uuid, village_name, crop, wood, clay, iron } = this.state;
		this.props.submit({ ident, uuid, village_name, crop, wood, clay, iron });
	}

	delete = async e => {
		const { ident, uuid, village_name, crop, wood, clay, iron } = this.state;
		this.props.delete({ ident, uuid, village_name, crop, wood, clay, iron });
	}

	cancel = async e => {
		route('/');
	}

	render() {
		const { all_villages, village_name, error_village, crop, iron, wood, clay } = this.state;

		const village_select_class = classNames({
			select: true,
			'is-radiusless': true,
			'is-danger': error_village
		});

		const villages = all_villages.map(village => <option value={ village.data.name }>{ village.data.name }</option>);

		return (
			<div>
				<div className="columns">

					<div className="column">
						<Input
							label='wood'
							placeholder='level'
							value={ wood }
							onChange={ e => this.setState({ wood: e.target.value }) }
						/>
						<Input
							label='clay'
							placeholder='level'
							value={ clay }
							onChange={ e => this.setState({ clay: e.target.value }) }
						/>
						<Input
							label='iron'
							placeholder='level'
							value={ iron }
							onChange={ e => this.setState({ iron: e.target.value }) }
						/>
					</div>

					<div className="column">
						<div class="field">
							<label class="label">select village</label>
							<div class="control">
								<div class={ village_select_class }>
									<select
										class="is-radiusless"
										value={ village_name }
										onChange={ (e) => this.setState({ village_name: e.target.value }) }
									>
										{ villages }
									</select>
								</div>
							</div>
						</div>

						<Input
							label='crop'
							placeholder='level'
							value={ crop }
							onChange={ e => this.setState({ crop: e.target.value }) }
						/>
					</div>

				</div>

				<div className="columns">
					<div className="column">
						<button className="button is-success is-radiusless" onClick={ this.submit } style='margin-right: 1rem'>
							submit
						</button>
						<button className="button is-radiusless" onClick={ this.cancel } style='margin-right: 1rem'>
							cancel
						</button>

						<button className="button is-danger is-radiusless" onClick={ this.delete }>
							delete
						</button>
					</div>
					<div className="column">
					</div>
				</div>

			</div>
		);
	}
}
