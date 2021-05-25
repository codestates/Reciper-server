import app from '../../app';
import { Socket } from '../../node_modules/socket.io/dist/socket';

const socketKanban = (socket: Socket) => {
	// kanban기능
	const kanbanIo = app.get('kanbanIo');
	const { projectId, userId } = socket.handshake.query;
	// 💚/kanban#event - 기능
	socket.on('event', () => {
		console.log('💚/kanban#event-');
	});
};
export default socketKanban;
