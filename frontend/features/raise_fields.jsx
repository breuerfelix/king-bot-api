import { h, render, Component } from 'preact';
import { route } from 'preact-router';
import classNames from 'classnames';
import axios from 'axios';
import { connect } from 'unistore/preact';

import Input from '../components/input';
import { storeKeys } from '../language';

@connect(storeKeys)
export default class RaiseFields extends Component {
	state = {
		all_villages: [],
		village_name: '',
		village_id: 0,
		error_village: false,
		crop: 0,
		wood: 0,
		clay: 0,
		iron: 0,
	}

	componentWillMount() {
		this.setState({ ...this.props.feature });

		axios.get('/api/data?ident=villages').then(res => this.setState({ all_villages: res.data }));
	}

	async submit() {
		this.setState({ error_village: (this.state.village_id == 0) });

		if (this.state.error_village) return;

		const { ident, uuid, village_name, village_id, crop, wood, clay, iron } = this.state;
		this.props.submit({ ident, uuid, village_name, village_id, crop, wood, clay, iron });
	}

	async delete() {
		const { ident, uuid, village_name, village_id, crop, wood, clay, iron } = this.state;
		this.props.delete({ ident, uuid, village_name, village_id, crop, wood, clay, iron });
	}

	async cancel() {
		route('/');
	}

	render(props) {
		const {
			all_villages, village_name, village_id,
			error_village, crop, iron, wood, clay,
		} = this.state;

		const village_select_class = classNames({
			select: true,
			'is-radiusless': true,
			'is-danger': error_village,
		});

		const villages = all_villages.map(village =>
			<option
				value={ village.data.villageId }
				village_name={ village.data.name }
			>
				({village.data.coordinates.x}|{village.data.coordinates.y}) {village.data.name}
			</option>
		);

		return (
			<div>
				<div className='columns'>

					<div className='column'>
						<Input
							label={ props.lang_queue_wood }
							placeholder={ props.lang_queue_level }
							value={ wood }
							onChange={ e => this.setState({ wood: e.target.value }) }
						/>
						<Input
							label={ props.lang_queue_clay }
							placeholder={ props.lang_queue_level }
							value={ clay }
							onChange={ e => this.setState({ clay: e.target.value }) }
						/>
						<Input
							label={ props.lang_queue_iron }
							placeholder={ props.lang_queue_level }
							value={ iron }
							onChange={ e => this.setState({ iron: e.target.value }) }
						/>
					</div>

					<div className='column'>
						<div class='field'>
							<label class='label'>{props.lang_combo_box_select_village}</label>
							<div class='control'>
								<div class={ village_select_class }>
									<select
										class='is-radiusless'
										value={ village_id }
										onChange={ e => this.setState({
											village_name: e.target[e.target.selectedIndex].attributes.village_name.value,
											village_id: e.target.value,
										})
										}
									>
										{ villages }
									</select>
								</div>
							</div>
						</div>

						<Input
							label={ props.lang_queue_crop }
							placeholder={ props.lang_queue_level }
							value={ crop }
							onChange={ e => this.setState({ crop: e.target.value }) }
						/>
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
						<button
							className='button is-radiusless'
							onClick={ this.cancel.bind(this) }
							style={{ marginRight: '1rem' }}
						>
							{props.lang_button_cancel}
						</button>

						<button
							className='button is-danger is-radiusless'
							onClick={ this.delete.bind(this) }
						>
							{props.lang_button_delete}
						</button>
					</div>
					<div className='column'>
					</div>
				</div>

			</div>
		);
	}
}
