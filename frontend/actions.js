import uniqid from 'uniqid';

const add_notification = {
	add_notification(state, message, level) {
		const noti = {
			id: uniqid.time(),
			message,
			level
		};

		return { notifications: [ ...state.notifications, noti ] };
	}
};

const handle_response = {
	handle_response(state, response) {
		if (!response.error) return;
		const { message } = response;

		const noti = {
			id: uniqid.time(),
			message,
			level: 'danger'
		};

		return { notifications: [ ...state.notifications, noti ] };
	}
};

export { add_notification, handle_response };
export default store => ({ ...add_notification, ...handle_response });
