import { h, render, Component } from 'preact';
import { route } from 'preact-router';
import axios from 'axios';
import classNames from 'classnames';

export default class SendTimedAttack extends Component {
	state = {
		name: 'send timed attack',
		village_name: '',
		wait_time: '',
		all_villages: [],
		target_x: '',
		target_y: '',
		target_villageId: '',
		target_village_name: '',
		target_playerId: '',
		target_player_name: '',
		target_tribeId: '',
		target_distance: '',
		t1:'',
		t2:'',
		t3:'',
		t4:'',
		t5:'',
		t6:'',
		t7:'',
		t8:'',
		t9:'',
		t10:'',
		t11:'',
		error_wait_time: false,
		error_village: false,
		error_target: false
	}

	componentWillMount() {
		this.setState({
			...this.props.feature
		});

		axios.get('/api/data?ident=villages').then(res => this.setState({ all_villages: res.data }));
	}
  
attackTarget = async e => {
	this.setState({ 
		error_wait_time: (this.state.wait_time == ''),
		error_village: (this.state.village_name == '')
	});

	if (this.state.error_wait_time || this.state.error_village){
		return;
	}

	const { village_name, target_x, target_y, target } = this.state;
	var x = Number(target_x);
	var y = Number(target_y);
	const villageID = 536887296 + x + (y * 32768);
	var response = await axios.post('/api/ownvillagenametoid', { village_name });
	const sourceVillageID = response.data;
	var params = {
		sourceVillage: sourceVillageID,
		destinationVillage: villageID
	};
	response = await axios.post('/api/findvillage2', params);
	const check_target_data = response.data;

	params = [
		`Village: ${villageID}`
	];
	response = await axios.post('/api/findvillage', params);
	const village = response.data[0].data;
	const target_villageId = village.villageId;
	const target_village_name = village.name;
	const target_distance = check_target_data.distance;
	const target_playerId = village.playerId;
	const target_tribeId = village.tribeId;
	const target_player_name = check_target_data.destPlayerName;
	this.setState({ target_villageId, target_village_name, target_x, target_y, target_playerId, target_player_name, target_tribeId, target_distance });
}

	submit = async e => {
		this.setState({ 
			error_wait_time: (this.state.wait_time == ''),
			error_village: (this.state.village_name == '')
		});

		if (this.state.error_wait_time || this.state.error_village) return;

		this.props.submit({ ...this.state });
	}

	delete = async e => {
		this.props.delete({ ...this.state });
	}

	cancel = async e => {
		route('/');
	}

	render() {
		const { wait_time, all_villages, village_name, target_x, target_y, target_player_name, target_village_name, target_tribeId, target_distance, 
			t1,
			t2,
			t3,
			t4,
			t5,
			t6,
			t7,
			t8,
			t9,
			t10,
			t11
		} = this.state;

		const input_wait_time = classNames({
			input: true,
			'is-radiusless': true,
			'is-danger': this.state.error_wait_time
		});

		const village_select_class = classNames({
			select: true,
			'is-danger': this.state.error_village
		});
    
		const row_style = {
			verticalAlign: 'middle',
			textAlign: 'center',
		};

		const villages = all_villages.map(village => <option value={ village.data.name }>{ village.data.name }</option>);

		return (
			<div>
				<div className="columns">

					<div className="column">
						
						<label style='margin-top: 2rem' class="label">wait time in seconds</label>
						<input 
							class={ input_wait_time }
							style="width: 150px;margin-right: 10px;"
							type="text" 
							value={ wait_time } 
							placeholder="min" 
							onChange={ (e) => this.setState({ wait_time: e.target.value }) }
						/>
						<input
							style="width: 150px;"
							type="text"
							value={target_x}
							placeholder="0"
							onChange={(e) => this.setState({ target_x: e.target.value })}
						/>
						<input
							style="width: 150px;"
							type="text"
							value={target_y}
							placeholder="0"
							onChange={(e) => this.setState({ target_y: e.target.value })}
						/>
						<p class="help">provide a number</p>

						<button className='button is-radiusless is-success' style='margin-right: 1rem' onClick={this.attackTarget}>
              set target
						</button>

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

				<div>
					<table className="table is-hoverable is-fullwidth">
						<thead>
							<tr>
								<th style={row_style}>distance</th>
								<th style={row_style}>player</th>
								<th style={row_style}>village</th>
								<th style={row_style}>t1</th>
								<th style={row_style}>t2</th>
								<th style={row_style}>t3</th>
								<th style={row_style}>t4</th>
								<th style={row_style}>t5</th>
								<th style={row_style}>t6</th>
								<th style={row_style}>t7</th>
								<th style={row_style}>t8</th>
								<th style={row_style}>t9</th>
								<th style={row_style}>t10</th>
								<th style={row_style}>t11</th>
								<th />
							</tr>
						</thead>
						<tbody>
							<tr>
								<td style={row_style}>
									{target_distance}
								</td>
								<td style={row_style}>
									{target_player_name}
								</td>
								<td style={row_style}>
									{target_village_name}
								</td>
								<td style={row_style}>
									<input
										style="width: 30px;"
										type="text"
										value={t1}
										placeholder="t1"
										onChange={async e => {
											this.setState({ t1: e.target.value });
										}}
									/>
								</td>
								<td style={row_style}>
									<input
										style="width: 30px;"
										type="text"
										value={t2}
										placeholder="t2"
										onChange={async e => {
											this.setState({ t2: e.target.value });
										}}
									/>
								</td>
								<td style={row_style}>
									<input
										style="width: 30px;"
										type="text"
										value={t3}
										placeholder="t3"
										onChange={async e => {
											this.setState({ t3: e.target.value });
										}}
									/>
								</td>
								<td style={row_style}>
									<input
										style="width: 30px;"
										type="text"
										value={t4}
										placeholder="t4"
										onChange={async e => {
											this.setState({ t4: e.target.value });
										}}
									/>
								</td>
								<td style={row_style}>
									<input
										style="width: 30px;"
										type="text"
										value={t5}
										placeholder="t5"
										onChange={async e => {
											this.setState({ t5: e.target.value });
										}}
									/>
								</td>
								<td style={row_style}>
									<input
										style="width: 30px;"
										type="text"
										value={t6}
										placeholder="t6"
										onChange={async e => {
											this.setState({ t6: e.target.value });
										}}
									/>
								</td>
								<td style={row_style}>
									<input
										style="width: 30px;"
										type="text"
										value={t7}
										placeholder="t7"
										onChange={async e => {
											this.setState({ t7: e.target.value });
										}}
									/>
								</td>
								<td style={row_style}>
									<input
										style="width: 30px;"
										type="text"
										value={t8}
										placeholder="t8"
										onChange={async e => {
											this.setState({ t8: e.target.value });
										}}
									/>
								</td>
								<td style={row_style}>
									<input
										style="width: 30px;"
										type="text"
										value={t9}
										placeholder="t9"
										onChange={async e => {
											this.setState({ t9: e.target.value });
										}}
									/>
								</td>
								<td style={row_style}>
									<input
										style="width: 30px;"
										type="text"
										value={t10}
										placeholder="t10"
										onChange={async e => {
											this.setState({ t10: e.target.value });
										}}
									/>
								</td>
								<td style={row_style}>
									<input
										style="width: 30px;"
										type="text"
										value={t11}
										placeholder="t11"
										onChange={async e => {
											this.setState({ t11: e.target.value });
										}}
									/>
								</td>
							</tr>
						</tbody>
					</table>
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
