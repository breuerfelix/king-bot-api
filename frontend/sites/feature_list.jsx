import { h, render, Component } from 'preact';
import axios from 'axios';
import { connect } from 'unistore/preact';

import Feature from '../components/feature';
import { storeKeys } from '../language';

const rowStyle = {
	verticalAlign: 'middle',
	textAlign: 'center'
};

@connect(storeKeys)
export default class FeatureList extends Component {
	state = {
		features: [],
	}

	async componentDidMount() {
		const res = await axios.get('/api/allfeatures');
		this.setState({ features: res.data });
	}

	render(props, state) {
		const features = state.features
			.map(feature => <Feature feature={ feature } />);

		return (
			<div>
				<h1 className='subtitle is-4' align='center'>
					{props.lang_home_features}
				</h1>
				<table className='table is-hoverable is-fullwidth'>
					<thead>
						<tr>
							<th style={ rowStyle }>{props.lang_home_name}</th>
							<th style={ rowStyle }>{props.lang_home_description}</th>
							<th style={ rowStyle }>{props.lang_home_status}</th>
							<th style={ rowStyle }>{props.lang_home_off_on}</th>
							<th style={ rowStyle }>{props.lang_home_options}</th>
						</tr>
					</thead>
					<tbody>
						{features}
					</tbody>
				</table>
			</div>
		);
	}
}
