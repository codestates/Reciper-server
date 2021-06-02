import app from '../../app';
import { Socket } from 'socket.io/dist/socket';
import { getRepository } from 'typeorm';
import { Projects } from '../../src/entity/Projects';
import { Chats } from '../../src/entity/Chats';
import { Users } from '../../src/entity/Users';

const socketChat = (socket: Socket) => {
	// chat 기능
	const chatIo = app.get('chatIo');
	const { projectId, userId } = socket.handshake.query;

	// TODO: 💚/chat#joinRoom - 방 입장
	socket.on('joinRoom', room => {
		console.log('💚/chat#joinRoom-', { room });
		socket.join(room);
	});

	// TODO: 💚/chat#leaveRoom - 방 퇴장
	socket.on('leaveRoom', room => {
		console.log('💚/chat#leaveRoom-', { room });
		socket.leave(room);
	});

	// TODO: 💚/chat#sendMessage - 채팅 메시지 보내기/저장
	socket.on('sendMessage', async ({ room, name, message }) => {
		console.log('💚/chat#sendMessage-', { room, name, message });
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
				uploadImage: '',
				writer: nowUser,
				project: nowProject,
				room,
			});
			await chat.save();
			socket.to(room).emit('sendMessage', { ...chat });
			socket.emit('nowMessageId', { id: chat.id });
		} catch (err) {
			console.log('💚/chat#sendMessage-err:', err.message);
		}
	});

	// TODO: 💚/chat#sendImage - 이미지 보내기/저장
	socket.on('sendImage', async ({ room, name, uploadImage }) => {
		console.log('💚/chat#sendImage-', { room, name, uploadImage });
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
				uploadImage,
				text: '',
				writer: nowUser,
				project: nowProject,
				room,
			});
			await chat.save();
			socket.broadcast.to(room).emit('sendImage', { ...chat });
		} catch (err) {
			console.log('💚/chat#sendImage-err:', err.message);
		}
	});

	// TODO: 💚/chat#editMessage - 채팅 메시지 수정
	socket.on('editMessage', async ({ room, index, id, message }) => {
		console.log('💚/chat#editMessage-', { room, index, id, message });
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
				socket.broadcast.to(room).emit('editMessage', { chat: foundChat, index });
			}
		} catch (err) {
			console.log('💚/chat#editMessage-err:', err.message);
		}
	});

	// TODO: 💚/chat#deleteMessage - 채팅 메시지 삭제
	socket.on('deleteMessage', async ({ room, index, id }) => {
		console.log('💚/chat#deleteMessage-', { room, index, id });
		try {
			const foundChat = await Chats.findOne({
				where: {
					id,
				},
			});
			if (foundChat) {
				await foundChat.remove();
				socket.broadcast.to(room).emit('deleteMessage', { index, id });
			}
		} catch (err) {
			console.log('💚/chat#deleteMessage-err:', err.message);
		}
	});

	// TODO: 💚/chat#getAllMessages - 모든 메시지 조회
	socket.on('getAllMessages', async ({ room, order }) => {
		console.log('💚/chat#getAllMessages-', { room, order });
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
		const COUNT_SCROLL = 30;
		let isEnd = false;
		let total = chats.length;
		let start_chat = total - (order + 1) * COUNT_SCROLL;
		if (start_chat < 0) {
			// 마지막 chat인지 확인
			start_chat = 0;
			isEnd = true;
		}
		let end_chat = total - order * COUNT_SCROLL;
		let sliceChats = chats.slice(start_chat, end_chat);
		console.log(
			'💚/chat#getAllMessages-result:',
			sliceChats.map(el => el.text),
		); // test
		socket.emit('getAllMessages', { chats: sliceChats, isEnd });
	});
};

export default socketChat;
