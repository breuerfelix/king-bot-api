import { h, render, Component } from 'preact';
import { connect } from 'unistore/preact';

const actions = store => ({
	remove(state, id) {
		return { notifications: [ ...state.notifications.filter(item => item.id !== id) ] };
	},
});

export default connect('notifications', actions)(({ notifications, remove }) => {
	const notis = notifications.map(noti => <Notification remove={ remove } notification={ noti } />);

	return (
		<div style={{ marginTop: '1rem' }}>
			{notis}
		</div>
	);
});

const Notification = ({ remove, notification }) => {
	const { id, message, level } = notification;

	const noti = `notification is-radiusless is-${level}`;

	return (
		<div class={ noti }>
			<button class='delete' onClick={ () => remove(id) }></button>
			{message}
		</div>
	);
};
