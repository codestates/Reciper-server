import { Socket } from 'socket.io/dist/socket';
import app from '../../app';

const users: any = {};
const socketToRoom: any = {};

const socketWebRTC = async (socket: Socket) => {
	// const webRTCIo = app.get('webRTCIo');
	// console.log(socket);
	socket.on('join room', roomID => {
		console.log('조인!!!', roomID);
		if (users[roomID]) {
			const length = users[roomID].length;
			if (length === 4) {
				socket.emit('room full');
				return;
			}
			users[roomID].push(socket.id);
		} else {
			users[roomID] = [socket.id];
		}
		socketToRoom[socket.id] = roomID;
		const usersInThisRoom = users[roomID].filter((id: string) => id !== socket.id);

		socket.emit('all users', usersInThisRoom);
	});
	socket.on('leave room', roomID => {
		console.log('리브!!!', roomID);

		for (let i = 0; i < users[roomID].length; i++) {
			if (users[roomID][i] === socket.id) {
				users[roomID].splice(i, 1);
				i--;
			}
		}

		delete socketToRoom[socket.id];
		const usersInThisRoom = users[roomID].filter((id: string) => id !== socket.id);

		socket.emit('all users', usersInThisRoom);
	});

	socket.on('sending signal', payload => {
		socket.to(payload.userToSignal).emit('user joined', { signal: payload.signal, callerID: payload.callerID });
	});

	socket.on('returning signal', payload => {
		socket.to(payload.callerID).emit('receiving returned signal', { signal: payload.signal, id: socket.id });
	});

	socket.on('disconnect', () => {
		const roomID = socketToRoom[socket.id];
		let room = users[roomID];
		if (room) {
			room = room.filter((id: string) => id !== socket.id);
			users[roomID] = room;
		}
	});
};

export default socketWebRTC;
