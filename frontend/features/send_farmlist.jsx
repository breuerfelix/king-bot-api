import { h, render, Component } from 'preact';
import { route } from 'preact-router';
import axios from 'axios';
import classNames from 'classnames';

export default class SendFarmlist extends Component {
	state = {
		name: 'send farmlist',
		farmlists: [],
		selected_farmlist: '',
		village_name: '',
		interval_min: '',
		interval_max: '',
		all_farmlists: [],
		all_villages: [],
		error_input_min: false,
		error_input_max: false,
		error_village: false,
		error_farmlist: false
	}

	componentWillMount() {
		this.setState({
			...this.props.feature
		});

		if(this.state.farmlists.length > 0) this.setState({ selected_farmlist: this.state.farmlists[0] });

		axios.get('/api/data?ident=villages').then(res => this.setState({ all_villages: res.data }));
		axios.get('/api/data?ident=farmlists').then(res => this.setState({ all_farmlists: res.data }));
	}

	handle_multi = e => {
		this.setState({
			selected_farmlist: e.target.value,
			farmlists: [ e.target.value ]
		});
	}

	submit = async e => {
		this.setState({ 
			error_input_min: (this.state.interval_min == ''),
			error_input_max: (this.state.interval_max == ''),
			error_farmlist: (this.state.selected_farmlist == ''),
			error_village: (this.state.village_name == '')
		});

		if(this.state.error_input_min || this.state.error_input_max || this.state.error_village || this.state.error_farmlist) return;

		this.props.submit({ ...this.state });
	}

	delete = async e => {
		this.props.delete({ ...this.state });
	}

	cancel = async e => {
		route('/');
	}

	render() {
		const { interval_min, interval_max, all_villages, all_farmlists, village_name, selected_farmlist } = this.state;

		const input_class_min = classNames({
			input: true,
			'is-radiusless': true,
			'is-danger': this.state.error_input_min
		});

		const input_class_max = classNames({
			input: true,
			'is-radiusless': true,
			'is-danger': this.state.error_input_max
		});

		const village_select_class = classNames({
			select: true,
			'is-danger': this.state.error_village
		});

		const farmlist_select_class = classNames({
			select: true,
			'is-danger': this.state.error_farmlist
		});

		const villages = all_villages.map(village => <option value={ village.data.name }>{ village.data.name }</option>);
		const farmlist_opt = all_farmlists.map(farmlist => <option value={ farmlist.data.listName }>{ farmlist.data.listName }</option>);

		return (
			<div>
				<div className="columns">

					<div className="column">
						<label class="label">select farmlists</label>
						<div class={ farmlist_select_class }>
							<select 
								class="is-radiusless"
								value={ selected_farmlist }
								onChange={ this.handle_multi }
							>
								{ farmlist_opt }
							</select>
						</div>


						<label style='margin-top: 2rem' class="label">interval in seconds (min / max)</label>
						<input 
							class={ input_class_min }
							style="width: 150px;margin-right: 10px;"
							type="text" 
							value={ interval_min } 
							placeholder="min" 
							onChange={ (e) => this.setState({ interval_min: e.target.value }) }
						/>
						<input 
							class={ input_class_max }
							style="width: 150px;"
							type="text" 
							value={ interval_max } 
							placeholder="max" 
							onChange={ (e) => this.setState({ interval_max: e.target.value }) }
						/>
						<p class="help">provide a number</p>

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


					</div>

				</div>

				<div className="columns">
					<div className="column">
						<button className="button is-radiusless is-success" onClick={ this.submit } style='margin-right: 1rem'>
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
