import { h, render, Component } from 'preact';

import classNames from 'classnames';

import { connect } from 'unistore/preact';

const actions = store => ({
	remove(state, id) {
		return { notifications: [ ...state.notifications.filter(item => item.id !== id) ] };
	}
});

@connect('notifications', actions)
export default class Notifications extends Component {
	render({ notifications, remove }) {
		const notis = notifications.map(noti => <Notification remove={ remove } notification={ noti } />);

		return (
			<div style='margin-top: 1rem'>
				{ notis }
			</div>
		);
	}
}

class Notification extends Component {
	render({ remove, notification }) {
		const { id, message, level } = notification;

		const noti = `notification is-radiusless is-${ level }`;

		return (
			<div class={ noti }>
				<button class="delete" onClick={ e => remove(id) }></button>
				{ message }
			</div>
		);
	}
}
