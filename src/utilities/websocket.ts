import connect from 'socket.io-client';
import io from 'socket.io-client';

export function trySocket() {
	const socket = connect('https://com7.kingdoms.com/chat/socket.io/?EIO=3&transport=websocket');

	socket.on('message', function (data: any) {
		console.log('Received a message from the server!', data);
	});
	return (socket)
}

export function ex() {

	var socket = io.connect('https://com7.kingdoms.com/chat/socket.io/?EIO=3&transport=websocket');



	socket.on('connect_failed', function () {
		console.log('Connection Failed');
	});

	socket.on('connect', function (data: any) {
		console.log(data)
	})

	socket.on('event', function (data: any) {
		console.log(data)
	})
	socket.on('disconnect', function (data: any) {
		console.log(data)
	})

}