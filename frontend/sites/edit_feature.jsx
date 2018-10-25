import { h, render, Component } from 'preact';
import state from '../other/state';
import { route } from 'preact-router';

import Adventure from '../components/adventure';

class EditFeature extends Component {
	state = {
		ident: ''
	}

	componentWillMount() {
		if(!state.edit_feature) {
			route('/');
			return false;
		}

		this.setState({
			...state.edit_feature
		});
	}

	render() {
		if(!state.edit_feature) {
			route('/');
			return false;
		}

		let feat = null;

		switch(this.state.ident) {
			case 'hero':
				feat = <Adventure feature={ this.state } />;
				break;
		}

		return (
			<div class="columns is-centered">
				<div className="column is-two-thirds">
					<div>
						{ feat }
					</div>
				</div>
			</div>
		);
	}
}

export default EditFeature;
