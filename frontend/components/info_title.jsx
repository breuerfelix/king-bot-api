import { h } from 'preact';
import { connect } from 'unistore/preact';
import actions from '../actions';

export default connect('', actions)(({ title, description, add_notification }) => (
	<h1 className='subtitle is-4' style={{ marginBottom: '2rem' }} align='center'>{ title }
		<a class='has-text-black' onClick={ e => add_notification(description, 'info') }>
			<span class='icon is-large'>
				<i class='fas fa-info'></i>
			</span>
		</a>

	</h1>
));
