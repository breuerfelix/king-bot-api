import { h, render, Component } from 'preact';
import { route } from 'preact-router';
import axios from 'axios';
import classNames from 'classnames';
import arrayMove from 'array-move';
import { connect } from 'unistore/preact';
import { storeKeys } from '../language';

const headerStyle = {
	textAlign: 'center',
};

@connect(storeKeys)
export default class BuildingQueue extends Component {
	state = {
		village_name: '',
		village_id: 0,
		all_villages: [],
		queue: [],
		error_village: false,
		buildings: [],
		resources: [],
		buildings_dict: null,
	}

	componentWillMount() {
		this.setState({
			...this.props.feature,
		});
	}

	componentDidMount() {
		if (this.state.village_id) this.village_changes({ target: { value: this.state.village_id } });

		axios.get('/api/data?ident=villages').then(res => this.setState({ all_villages: res.data }));
		axios.get('/api/data?ident=buildingdata').then(res => this.setState({ buildings_dict: res.data }));
	}

	async submit() {
		this.setState({
			error_village: (this.state.village_id == 0),
		});

		if (this.state.error_village) return;

		const { ident, uuid, village_name, village_id, queue } = this.state;
		this.props.submit({ ident, uuid, village_name, village_id, queue });
	}

	async delete() {
		const { ident, uuid, village_name, village_id, queue } = this.state;
		this.props.delete({ ident, uuid, village_name, village_id, queue });
	}

	async cancel() {
		route('/');
	}

	async village_changes(e) {
		if (!e.target.value) return;

		this.setState({
			village_name: e.target[e.target.selectedIndex].attributes.village_name.value,
			village_id: e.target.value,
		});
		let response = await axios.get(`/api/data?ident=buildings&village_id=${this.state.village_id}`);
		let res = [];
		let bd = [];

		for (let item of response.data) {
			if (Number(item.buildingType) > 4) {
				bd.push(item);
				continue;
			}

			res.push(item);
		}

		res = res.sort((x1, x2) => Number(x1.buildingType) - Number(x2.buildingType));
		bd = bd.sort((x1, x2) => Number(x1.buildingType) - Number(x2.buildingType));

		this.setState({
			buildings: bd,
			resources: res,
		});
	}

	upgrade(building) {
		const { buildingType, lvl, locationId } = building;
		const queue_item = {
			type: buildingType,
			location: locationId,
			costs: {
				...building.upgradeCosts,
			},
			upgrade_time: building.upgradeTime,
		};

		this.setState({ queue: [ ...this.state.queue, queue_item ] });
	}

	delete_item(building) {
		const queues = this.state.queue;
		var idx = queues.indexOf(building);
		if (idx != -1) {
			queues.splice(idx, 1); // The second parameter is the number of elements to remove.
		}

		this.setState({ queue: [ ...queues ] });
	}

	move_up(building) {
		const queues = this.state.queue;
		var idx = queues.indexOf(building);
		if (idx != -1) {
			arrayMove.mut(queues, idx, idx - 1); // The second parameter is the number of elements to remove.
		}

		this.setState({ queue: [ ...queues ] });
	}

	move_down(building) {
		const queues = this.state.queue;
		var idx = queues.indexOf(building);
		if (idx != -1) {
			arrayMove.mut(queues, idx, idx + 1); // The second parameter is the number of elements to remove.
		}

		this.setState({ queue: [ ...queues ] });
	}

	render(props, { name, all_villages, village_name, village_id, queue, buildings, resources, buildings_dict }) {
		const village_select_class = classNames({
			select: true,
			'is-danger': this.state.error_village,
		});

		let buildings_options = [];
		if (buildings_dict) {
			buildings_options = buildings.map(building =>
				<tr>
					<td style={ headerStyle }>{ building.locationId }</td>
					<td>{ buildings_dict[building.buildingType] }</td>
					<td style={ headerStyle }>{ building.lvl }</td>
					<td style={ headerStyle }>
						<a class='has-text-black' onClick={ () => this.upgrade(building) }>
							<span class='icon is-medium'>
								<i class='far fa-lg fa-arrow-alt-circle-up'></i>
							</span>
						</a>
					</td>
				</tr>
			);
		}

		let resource_options = [];
		if (buildings_dict) {
			resource_options = resources.map(building =>
				<tr>
					<td style={ headerStyle }>{ building.locationId }</td>
					<td>{ buildings_dict[building.buildingType] }</td>
					<td style={ headerStyle }>{ building.lvl }</td>
					<td style={ headerStyle }>
						<a class='has-text-black' onClick={ () => this.upgrade(building) }>
							<span class='icon is-medium'>
								<i class='far fa-lg fa-arrow-alt-circle-up'></i>
							</span>
						</a>
					</td>
				</tr>
			);
		}

		let queue_options = [];
		if (buildings_dict) {
			queue_options = queue.map((building, index) =>
				<tr>
					<td style={ headerStyle }>{ index + 1 }</td>
					<td style={ headerStyle }>{ building.location }</td>
					<td>{ buildings_dict[building.type] }</td>
					<td style={ headerStyle }>
						<a class='has-text-black' onClick={ () => this.move_up(building) }>
							<span class='icon is-medium'>
								<i class='fas fa-lg fa-long-arrow-alt-up'></i>
							</span>
						</a>
					</td>
					<td style={ headerStyle }>
						<a class='has-text-black' onClick={ () => this.move_down(building) }>
							<span class='icon is-medium'>
								<i class='fas fa-lg fa-long-arrow-alt-down'></i>
							</span>
						</a>
					</td>
					<td style={ headerStyle }>
						<a class='has-text-black' onClick={ () => this.delete_item(building) }>
							<span class='icon is-medium'>
								<i class='far fa-lg fa-trash-alt'></i>
							</span>
						</a>
					</td>
				</tr>
			);
		}

		const villages = all_villages.map(village =>
			<option value={ village.data.villageId } village_name={ village.data.name } >
				({village.data.coordinates.x}|{village.data.coordinates.y}) {village.data.name}
			</option>
		);


		return (
			<div>
				<div className='columns'>
					<div className='column'>
						<div class='field'>
							<label class='label'>{props.lang_combo_box_select_village}</label>
							<div class='control'>
								<div class={ village_select_class }>
									<select
										class='is-radiusless'
										value={ village_id }
										onChange={ this.village_changes.bind(this) }
									>
										{ villages }
									</select>
								</div>
								<a
									className='button is-success is-radiusless'
									style={{ marginLeft: '3rem', marginRight: '1rem' }}
									onClick={ this.submit.bind(this) }
								>{props.lang_button_submit}</a>
								<a
									className='button is-danger is-radiusless'
									onClick={ this.delete.bind(this) }
								>{props.lang_button_delete}</a>

							</div>
						</div>
					</div>
				</div>

				<div className='columns' style={{ marginTop: '2rem' }} >

					<div className='column' align='center'>
						<strong>{props.lang_queue_res_fields}</strong>
						<table className="table is-striped">
							<thead>
								<tr>
									<td style={ headerStyle }><strong>{props.lang_table_id}</strong></td>
									<td><strong>{props.lang_table_name}</strong></td>
									<td style={ headerStyle }><strong>{props.lang_table_lvl}</strong></td>
									<td style={ headerStyle }><strong></strong></td>
								</tr>
							</thead>
							<tbody>
								{resource_options}
							</tbody>
						</table>
					</div>

					<div className='column' align='center'>
						<strong>{props.lang_queue_buildings}</strong>
						<table className='table is-striped'>
							<thead>
								<tr>
									<td style={ headerStyle }><strong>{props.lang_table_id}</strong></td>
									<td><strong>{props.lang_table_name}</strong></td>
									<td style={ headerStyle }><strong>{props.lang_table_lvl}</strong></td>
									<td style={ headerStyle }><strong></strong></td>
								</tr>
							</thead>
							<tbody>
								{buildings_options}
							</tbody>
						</table>
					</div>

					<div className='column' align='center'>
						<strong>{props.lang_queue_queue}</strong>
						<table className='table is-striped'>
							<thead>
								<tr>
									<td style={ headerStyle }><strong>{props.lang_table_pos}</strong></td>
									<td style={ headerStyle }><strong>{props.lang_table_id}</strong></td>
									<td><strong>{props.lang_table_name}</strong></td>
									<td style={ headerStyle }><strong></strong></td>
									<td style={ headerStyle }><strong></strong></td>
									<td style={ headerStyle }><strong></strong></td>
								</tr>
							</thead>
							<tbody>
								{queue_options}
							</tbody>
						</table>
					</div>
				</div>

			</div>
		);
	}
}
