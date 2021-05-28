import app from '../../app';
import { Socket } from '../../node_modules/socket.io/dist/socket';
import { getRepository } from 'typeorm';
import { Projects } from '../../src/entity/Projects';
import { Chats } from '../../src/entity/Chats';
import { Users } from '../../src/entity/Users';

const socketChat = (socket: Socket) => {
	// chat 기능
	const chatIo = app.get('chatIo');
	const { projectId, userId } = socket.handshake.query;

	// 💚/chat#joinRoom - 방 입장
	socket.on('joinRoom', room => {
		console.log('💚/chat#joinRoom-', room);
		socket.join(room);
	});

	// 💚/chat#leaveRoom - 방 퇴장
	socket.on('leaveRoom', room => {
		console.log('💚/chat#leaveRoom-', room);
		socket.leave(room);
	});

	// 💚/chat#sendMessage - 채팅 메시지 보내기/저장
	socket.on('sendMessage', async ({ room, name, message }) => {
		console.log('💚/chat#sendMessage-', room, name, message);
		try {
			const nowProject = await Projects.findOne({
				where: {
					id: Number(projectId),
				},
			});
			const nowUser = await Users.findOne({
				where: {
					id: Number(userId),
				},
			});
			let chat = await Chats.create({
				text: message,
				writer: nowUser,
				project: nowProject,
				room,
			});
			await chat.save();
			socket.broadcast.to(room).emit('sendMessage', { ...chat });
		} catch (err) {
			console.log('💚/chat#sendMessage-err:', err.message);
		}
	});

	// 💚/chat#editMessage - 채팅 메시지 수정
	socket.on('editMessage', async ({ room, index, id, message }) => {
		console.log('💚/chat#editMessage-', room, index, id, message);
		try {
			const foundChat = await Chats.findOne({
				relations: ['writer', 'project'],
				where: {
					id,
				},
			});
			if (foundChat) {
				foundChat.text = message;
				await foundChat.save();
				socket.broadcast.to(room).emit('editMessage', { ...foundChat, index });
			}
		} catch (err) {
			console.log('💚/chat#editMessage-err:', err.message);
		}
	});

	// 💚/chat#deleteMessage - 채팅 메시지 삭제
	socket.on('deleteMessage', async ({ room, id }) => {
		console.log('💚/chat#deleteMessage-', room, id);
		try {
			const foundChat = await Chats.findOne({
				where: {
					id,
				},
			});
			if (foundChat) {
				await foundChat.remove();
				socket.broadcast.to(room).emit('deleteMessage', { id });
			}
		} catch (err) {
			console.log('💚/chat#deleteMessage-err:', err.message);
		}
	});

	// 💚/chat#getAllMessages - 모든 메시지 조회
	socket.on('getAllMessages', async room => {
		console.log('💚/chat#getAllMessages-', room);
		const nowProject = await Projects.findOne({
			where: {
				id: Number(projectId),
			},
		});
		const chats = await getRepository(Chats).find({
			relations: ['writer'],
			where: {
				project: nowProject,
				room,
			},
		});
		console.log(
			'💚/chat#getAllMessages-result:',
			chats.map(el => el.text),
		); // test
		chatIo.to(room).emit('getAllMessages', chats);
	});
};

export default socketChat;
