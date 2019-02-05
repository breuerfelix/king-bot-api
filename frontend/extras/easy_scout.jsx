import { h, render, Component } from 'preact';
import { route } from 'preact-router';
import axios from 'axios';
import classNames from 'classnames';
import { connect } from 'unistore/preact';
import { add_notification } from '../actions';
import InfoTitle from '../components/info_title';
import Input from '../components/input';

@connect('', add_notification)
export default class EasyScout extends Component {
	state = {
		name: 'easy scout',
		farmlists: [],
		selected_farmlist: '',
		village_name: '',
		amount: '1',
		mission: 'resources',
		all_farmlists: [],
		all_villages: [],
		error_village: false,
		error_farmlist: false,
		error_amount: false
	}

	description = 'send 1 scout to every farm in the given farmlist';

	componentDidMount() {
		axios.get('/api/data?ident=villages').then(res => this.setState({ all_villages: res.data, village_name: res.data[0].data.name }));
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
			error_farmlist: (this.state.selected_farmlist == ''),
			error_village: (this.state.village_name == ''),
			error_amount: (this.state.amount == '')
		});

		if (this.state.error_village || this.state.error_farmlist || this.state.error_amount) return;

		const payload = {
			list_name: this.state.selected_farmlist,
			village_name: this.state.village_name,
			amount: this.state.amount,
			mission: this.state.mission
		};

		const response = await axios.post('/api/easyscout', payload);
		if (response.data == 'success') route('/');
	}

	cancel = async e => {
		route('/');
	}

	render() {
		const { name, all_villages, all_farmlists, village_name, selected_farmlist, amount, mission } = this.state;

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
				<InfoTitle title={ name } description={ this.description } />

				<div className="columns">

					<div className="column">

						<div className="field">
							<label class="label">select farmlists</label>
							<div className="control">
								<div class={ farmlist_select_class }>
									<select
										class='is-radiusless'
										value={ selected_farmlist }
										onChange={ this.handle_multi }
									>
										{ farmlist_opt }
									</select>
								</div>
							</div>
						</div>

						<div class="field">
							<label class="label">spy for</label>
							<div class="control">
								<div class="select">
									<select
										class='is-radiusless'
										value={ mission }
										onChange={ e => this.setState({ mission: e.target.value }) }
									>
										<option value='resources'>resources</option>
										<option value='defence'>defence</option>
									</select>
								</div>
							</div>
						</div>

					</div>

					<div className="column">

						<div class="field">
							<label class="label">select village</label>
							<div class="control">
								<div class={ village_select_class }>
									<select
										class='is-radiusless'
										value={ village_name }
										onChange={ (e) => this.setState({ village_name: e.target.value }) }
									>
										{ villages }
									</select>
								</div>
							</div>
						</div>

						<Input
							label='amount'
							placeholder='default: 1'
							value={ amount }
							onChange={ e => this.setState({ amount: e.target.value }) }
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
					</div>
					<div className="column">
					</div>
				</div>
			</div>
		);
	}
}
