import app from '../../app';
import { Socket } from 'socket.io/dist/socket';
import { getRepository } from 'typeorm';
import { Projects } from '../../src/entity/Projects';
import { Chats } from '../../src/entity/Chats';
import { Users } from '../../src/entity/Users';

const socketChat = (socket: Socket) => {
	// chat κΈ°λ₯
	const chatIo = app.get('chatIo');
	const { projectId, userId } = socket.handshake.query;

	// TODO: π/chat#joinRoom - λ°© μμ₯
	socket.on('joinRoom', room => {
		console.log('π/chat#joinRoom-', { room });
		socket.join(room);
	});

	// TODO: π/chat#leaveRoom - λ°© ν΄μ₯
	socket.on('leaveRoom', room => {
		console.log('π/chat#leaveRoom-', { room });
		socket.leave(room);
	});

	// TODO: π/chat#sendMessage - μ±ν λ©μμ§ λ³΄λ΄κΈ°/μ μ₯
	socket.on('sendMessage', async ({ room, name, message, chatLength }) => {
		console.log('π/chat#sendMessage-', { room, name, message });
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
			socket.emit('nowMessageId', { id: chat.id, chatLength });
		} catch (err) {
			console.log('π/chat#sendMessage-err:', err.message);
		}
	});

	// TODO: π/chat#sendImage - μ΄λ―Έμ§ λ³΄λ΄κΈ°/μ μ₯
	socket.on('sendImage', async ({ room, name, uploadImage, chatLength }) => {
		console.log('π/chat#sendImage-', { room, name, uploadImage });
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
			socket.to(room).emit('sendImage', { ...chat });
			socket.emit('nowMessageId', { id: chat.id, chatLength });
		} catch (err) {
			console.log('π/chat#sendImage-err:', err.message);
		}
	});

	// TODO: π/chat#editMessage - μ±ν λ©μμ§ μμ 
	socket.on('editMessage', async ({ room, index, id, message }) => {
		console.log('π/chat#editMessage-', { room, index, id, message });
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
			console.log('π/chat#editMessage-err:', err.message);
		}
	});

	// TODO: π/chat#deleteMessage - μ±ν λ©μμ§ μ­μ 
	socket.on('deleteMessage', async ({ room, index, id }) => {
		console.log('π/chat#deleteMessage-', { room, index, id });
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
			console.log('π/chat#deleteMessage-err:', err.message);
		}
	});

	// TODO: π/chat#getAllMessages - λͺ¨λ  λ©μμ§ μ‘°ν
	socket.on('getAllMessages', async ({ room, order }) => {
		console.log('π/chat#getAllMessages-', { room, order });
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
			// λ§μ§λ§ chatμΈμ§ νμΈ
			start_chat = 0;
			isEnd = true;
		}
		let end_chat = total - order * COUNT_SCROLL;
		let sliceChats = chats.slice(start_chat, end_chat);
		socket.emit('getAllMessages', { chats: sliceChats, isEnd });
	});
};

export default socketChat;
