import { h, render, Component } from 'preact';
import { connect } from 'unistore/preact';
import { add_notification } from '../actions';

@connect('', add_notification)
export default class InfoTitle extends Component {

	render({ title, description }) {

		return	(
			<h1 className="subtitle is-4" style='margin-bottom: 2rem' align="center">{ title }
				<a class="has-text-black" onClick={ e => this.props.add_notification(description, 'info')  }>
					<span class="icon is-large">
						<i class="fas fa-info"></i>
					</span>
				</a>

			</h1>
		);
	}
}
