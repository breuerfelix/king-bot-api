import { h, render, Component } from 'preact';

import Feature from '../components/feature';
import AddFeature from '../components/add_feature';

class Home extends Component {
	render() {
		return (
			<div class="container">
				<div className="notification">
					<nav class="level">
						<div className="level-item has-text-centered">
							<strong>
								automate kingdoms
							</strong>
						</div>
					</nav>
				</div>
				<div class="columns is-centered">
					<div className="column is-half">
						current features:
						<br />
						<br />
						<Feature name='farming'/>
						<AddFeature />
					</div>
				</div>
			</div>
		);
	}
}

export default Home;
