import { h, render, Component } from 'preact';

import Feature from '../components/feature';

import axios from 'axios';

export default class FeatureList extends Component {
	state = {
		features: []
	}

	constructor(props) {
		super(props);
	}

	async componentDidMount() {
		const res = await axios.get('/api/allfeatures');
		this.setState({
			features: res.data
		});
	}

	render() {
		const row_style = {
			verticalAlign: 'middle',
			textAlign: 'center'
		};

		const features = this.state.features.map(feature => <Feature feature={ feature } />);

		return (
			<div>
				<h1 className="subtitle is-4" align="center">your features</h1>
				<table className="table is-hoverable is-fullwidth">
					<thead>
						<tr>
							<th style={ row_style }>feature name</th>
							<th style={ row_style }>description</th>
							<th style={ row_style }>status</th>
							<th style={ row_style }>off / on</th>
							<th style={ row_style }>options</th>
						</tr>
					</thead>
					<tbody>
						{ features }
					</tbody>
				</table>
			</div>
		);
	}
}
