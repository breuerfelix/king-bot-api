import { h, render, Component } from 'preact';
import { route } from 'preact-router';
import Adventure from '../components/adventure';
import SendFarmlist from '../components/send_farmlist';

import { connect } from 'unistore/preact';

@connect('edit_feature')
export default class EditFeature extends Component {
	state = {
		ident: ''
	}

	componentWillMount() {
		if(!this.props.edit_feature || Object.keys(this.props.edit_feature).length == 0) {
			route('/');
			return false;
		}

		this.setState({
			...this.props.edit_feature
		});
	}

	render() {
		if(!this.props.edit_feature || Object.keys(this.props.edit_feature).length == 0) {
			route('/');
			return false;
		}

		let feat = null;

		switch(this.state.ident) {
			case 'hero':
				feat = <Adventure feature={ this.state } />;
				break;
			case 'farming':
				feat = <SendFarmlist feature={ this.state } />;
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
