import { h, render, Component } from 'preact';
import { route } from 'preact-router';
import axios from 'axios';
import classNames from 'classnames';
import InactiveTable from '../components/inactive_table';
import DoubleInput from '../components/double_input';
import InfoTitle from '../components/info_title';
import BasicFarmlistTable from '../components/basic_farmlist_table';



export default class SendBasicFarmlist extends Component {
	state = {
		name: 'send farmlist',
		selected_farmlist: '',
		village_name: '',
		interval_min: '',
		interval_max: '',
		all_villages: [],
		inactives: [],
		error_input_min: false,
		error_input_max: false,
		error_village: false,
		min_player_pop: '',
		max_player_pop: '',
		min_village_pop: '',
		max_village_pop: '',
		min_distance: '',
		max_distance: '',
		inactive_for: '',
		farms: [],
		loading: false,
		message: '',
		newFarm_x: '',
		newFarm_y: '',
	}

	componentWillMount() {
		this.setState({
			...this.props.feature
		});

		if (this.state.name.length > 0) this.setState({ selected_farmlist: this.state.name[0] });

		axios.get('/api/data?ident=villages').then(res => this.setState({ all_villages: res.data }));

	}

	submit = async e => {
		this.setState({
			error_input_min: (this.state.interval_min == ''),
			error_input_max: (this.state.interval_max == ''),
			error_village: (this.state.village_name == '')
		});

		if (this.state.error_input_min || this.state.error_input_max || this.state.error_village) return;

		this.props.submit({ ...this.state });
	}

	unitChanged = async item => {
		const { farms } = this.state;

		var found = farms.find(function (farm) {
			return item.villageId == farm.villageId
		})

		found.unit_type = item.unit_type;
		found.unit_number = item.unit_number;
		found.priority = item.priority;
		this.setState({ farms: farms })
	}

	remove = async item => {
		const { farms } = this.state;

		var found = farms.find(function (farm) {
			return item.villageId == farm.villageId
		})

		var index = farms.indexOf(found);
		if (index > -1) {
			farms.splice(index, 1);
		}
		this.setState({ farms: farms })
	}

	clicked = async item => {
		const { farms } = this.state;

		var duplicate = false;
		farms.forEach(function (farm) {
			if (farm.villageId == item.villageId) duplicate = true;
		})
		if (!duplicate) farms.push(item)
		this.setState({ farms: farms })
		return true;
	}

	addFarm = async e => {
		const { farms, newFarm_x, newFarm_y } = this.state;
		console.log(e)
		console.log(newFarm_x)
		console.log(newFarm_y)
		var x = Number(newFarm_x);
		var y = Number(newFarm_y);
		const villageID = 536887296 + x + (y * 32768)
		const params = [
			`Village: ${villageID}`
		];
		let response = await axios.post('/api/findVillage', params);
		const village = response.data[0].data;
		console.log(village)
		var farm = {};
		farm.villageId = village.villageId;
		farm.isCity = village.isTown;
		farm.village_name = village.name;
		farm.population = village.population;
		farm.isMainVillage = village.isMainVillage;
		farm.distance = null;
		console.log(farms[0])
	}

	sort = async e => {
		const { farms } = this.state;
		function distance(a, b) {
			var apn = Number(a.priority)
			var bpn = Number(b.priority)
			var adn = Number(a.distance)
			var bdn = Number(b.distance)
			if (apn == null) apn = 10;
			if (bpn == null) bpn = 10;
			if (apn < bpn) {
				return -1;
			}
			else if (apn > bpn) {
				return 1;
			}
			else {
				if (adn < bdn) {
					return -1;
				}
				else if (adn > bdn) {
					return 1;
				}
				return 0;
			}
		}

		farms.sort(distance);

		this.setState({ farms: farms })
	}

	search = async e => {
    if (this.state.loading) return;
    const { farms } = this.state;


		this.setState({
			error_village: (this.state.village_name == '')
		});

		if (this.state.error_village) return;

		this.setState({ loading: true, message: '', inactives: [] });

		const {
			village_name,
			min_player_pop,
			max_player_pop,
			min_village_pop,
			max_village_pop,
			min_distance,
			max_distance,
			inactive_for,

		} = this.state;

		const payload_data = {
			village_name,
			min_distance,
			max_distance,
			min_player_pop,
			max_player_pop,
			min_village_pop,
			max_village_pop,
			inactive_for,
		};

		const payload = {
			action: 'get',
			data: payload_data
		};

		let response = await axios.post('/api/inactivefinder', payload);

    const { error, data, message } = response.data;
    
    data.forEach(function(inactive) {
      farms.forEach(function(farm){
        if(inactive.villageId == farm.villageId){
          inactive.toggled = true;
        }
      });
    });

		this.setState({ inactives: [...data], loading: false });

		if (error) {
			this.props.handle_response(response.data);
			return;
		}

		this.setState({ message });
	}

	delete = async e => {
		this.props.delete({ ...this.state });
	}

	cancel = async e => {
		route('/');
	}

	render() {
		const { interval_min, interval_max, all_villages, village_name, inactives, farms, message, min_player_pop, max_player_pop, min_village_pop, max_village_pop, min_distance, max_distance, inactive_for, loading, newFarm_x, newFarm_y } = this.state;

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

		const search_button = classNames({
			button: true,
			'is-success': true,
			'is-radiusless': true,
			'is-loading': loading
		});

		const villages = all_villages.map(village => <option value={village.data.name}>{village.data.name}</option>);

		return (
			<div>
				<div className="columns">
					<div className="column">

						<div class="field">
							<label class="label">select village</label>
							<div class="control">
								<div class={village_select_class}>
									<select
										class="is-radiusless"
										value={village_name}
										onChange={(e) => this.setState({ village_name: e.target.value })}
									>
										{villages}
									</select>
								</div>
							</div>
						</div>
					</div>
					<div className="column">
						<label class="label">interval in seconds (min / max)</label>
						<input
							class={input_class_min}
							style="width: 150px;margin-right: 10px;"
							type="text"
							value={interval_min}
							placeholder="min"
							onChange={(e) => this.setState({ interval_min: e.target.value })}
						/>
						<input
							class={input_class_max}
							style="width: 150px;"
							type="text"
							value={interval_max}
							placeholder="max"
							onChange={(e) => this.setState({ interval_max: e.target.value })}
						/>


						<p class="help">provide a number</p>



					</div>

				</div>
				<div className="columns" style="margin-top: 2em">
					<div className="column">
						<button className="button is-radiusless is-success" onClick={this.submit} style='margin-right: 1rem'>
							submit
						</button>
						<button className="button is-radiusless" onClick={this.cancel} style='margin-right: 1rem'>
							cancel
						</button>

						<button className="button is-danger is-radiusless" onClick={this.delete}>
							delete
						</button>
					</div>
					<div className="column">
					</div>
				</div>
				<input
					style="width: 150px;"
					type="text"
					value={newFarm_x}
					placeholder="0"
					onChange={(e) => this.setState({ newFarm_x: e.target.value })}
				/>
				<input
					style="width: 150px;"
					type="text"
					value={newFarm_y}
					placeholder="0"
					onChange={(e) => this.setState({ newFarm_y: e.target.value })}
				/>
				<button className='button is-radiusless' style='margin-right: 1rem' onClick={this.addFarm}>
					add farm
				</button>
				<button className='button is-radiusless' style='margin-right: 1rem' onClick={this.sort}>
					sort
        </button>
				<BasicFarmlistTable content={farms} clicked={this.remove} unitChanged={this.unitChanged} />
				<hr></hr>

				<InfoTitle title={name} description={this.description} />

				<div className="columns">

					<div className="column">

						<div class="field">
							<label class="label">distance relative to</label>
							<div class="control">
								<div class={village_select_class}>
									<select
										class="is-radiusless"
										value={village_name}
										onChange={(e) => this.setState({ village_name: e.target.value })}
									>
										{villages}
									</select>
								</div>
							</div>
						</div>

						<DoubleInput
							label='player pop (min / max)'
							placeholder1='default: 0'
							placeholder2='default: 500'
							value1={min_player_pop}
							value2={max_player_pop}
							onChange1={e => this.setState({ min_player_pop: e.target.value })}
							onChange2={e => this.setState({ max_player_pop: e.target.value })}
						/>

						<DoubleInput
							label='village pop (min / max)'
							placeholder1='default: 0'
							placeholder2='default: 200'
							value1={min_village_pop}
							value2={max_village_pop}
							onChange1={e => this.setState({ min_village_pop: e.target.value })}
							onChange2={e => this.setState({ max_village_pop: e.target.value })}
						/>

						<button className={search_button} onClick={this.search} style='margin-right: 1rem'>
							search
						</button>

					</div>
					<div className="column">

						<DoubleInput
							label='distance (min / max)'
							placeholder1='default: 0'
							placeholder2='default: 100'
							value1={min_distance}
							value2={max_distance}
							onChange1={e => this.setState({ min_distance: e.target.value })}
							onChange2={e => this.setState({ max_distance: e.target.value })}
						/>

						<label class="label">inactive for</label>
						<div class="field has-addons">
							<p class="control">
								<input
									class="input is-radiusless"
									type="text"
									placeholder="default: 5"
									value={inactive_for}
									onChange={e => this.setState({ inactive_for: e.target.value })}
								/>
							</p>
							<p class="control">
								<a class="button is-static is-radiusless">
									days
								</a>
							</p>
						</div>
						<div className="content" style='margin-top: 1.5rem' >
							{message}
						</div>
					</div>
				</div>

				<InactiveTable content={inactives} clicked={this.clicked} />




			</div>
		);
	}
}
