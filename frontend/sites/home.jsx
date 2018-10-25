import { h, render, Component } from 'preact';

import FeatureList from '../components/feature_list';

class Home extends Component {
	render() {
		return (
			<div class="container">
				<div className="notification">
					<nav class="level">
						<div className="level-item has-text-centered">
							<h1 className="title is-4">automate kingdoms</h1>
						</div>
					</nav>
				</div>
				<FeatureList />
			</div>
		);
	}
}

export default Home;
