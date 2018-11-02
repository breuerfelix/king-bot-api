import { h, render, Component } from 'preact';
import { route } from 'preact-router';
import axios from 'axios';
import classNames from 'classnames';

export default class InactiveFinder extends Component {
	state = {
		name: 'inactive finder',
		farmlists: [],
		selected_farmlist: '',
		village_name: '',
		all_farmlists: [],
		all_villages: [],
		error_village: false,
		error_farmlist: false
	}

	componentDidMount() {
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
		let payload = {
			list_name: this.state.selected_farmlist,
			village_name: this.state.village_name
		};
		let response = await axios.post('/api/inactivefinder', payload);
		console.log(response.data)
		return;
		this.setState({ 
			error_farmlist: (this.state.selected_farmlist == ''),
			error_village: (this.state.village_name == '')
		});

		if(this.state.error_village || this.state.error_farmlist) return;

		payload = {
			list_name: this.state.selected_farmlist,
			village_name: this.state.village_name
		};

		response = await axios.post('/api/easyscout', payload);
		if(response.data == 'success') route('/');
	}

	cancel = async e => {
		route('/');
	}

	render() {
		const { name, all_villages, all_farmlists, village_name, selected_farmlist } = this.state;

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
				<h1 className="subtitle is-4" style='margin-bottom: 2rem' align="center">easy scout</h1>

				<div className="content">send 1 scout to every farm in the given farmlist</div>
				<div className="columns">

					<div className="column">
						<label class="label">select farmlists</label>
						<div class={ farmlist_select_class }>
							<select 
								value={ selected_farmlist }
								onChange={ this.handle_multi }
							>
								{ farmlist_opt }
							</select>
						</div>

					</div>

					<div className="column">

						<div class="field">
							<label class="label">select village</label>
							<div class="control">
								<div class={ village_select_class }>
									<select 
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
						<button className="button is-success" onClick={ this.submit } style='margin-right: 1rem'>
							submit
						</button>
						<button className="button" onClick={ this.cancel } style='margin-right: 1rem'>
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
