import app from './app';
import * as dotenv from 'dotenv';
import { Projects } from './src/entity/Projects';
import { Chats } from './src/entity/Chats';
import { Users } from './src/entity/Users';
import { Socket } from './node_modules/socket.io/dist/socket';
import { getRepository } from 'typeorm';
import chatChecker from './middlewares/chatChecker';
dotenv.config();

const http = require('http');
const server = http.createServer(app);
const io_s = require('socket.io');
const io = io_s(server);
const { createClient } = require('redis');
const redisAdapter = require('@socket.io/redis-adapter');

try {
	const pubClient = createClient({
		host: process.env.REDIS_HOST,
		port: process.env.REDIS_PORT,
		password: process.env.REDIS_PASSWORD,
	});
	const subClient = pubClient.duplicate();
	console.log('💌 redis pub/sub setting done');

	io.adapter(redisAdapter(pubClient, subClient));

	// TODO: chat 기능 socket 통신
	const chatting = io.of('/chat');
	chatting.use(chatChecker);
	chatting.on('connection', (socket: Socket) => {
		console.log('💚/chat- connection');
		console.log(socket.handshake.query);
		const { projectId, userId } = socket.handshake.query;
    // 💚/chat#joinRoom - 방 입장
    socket.on('joinRoom', room => {
			console.log('💚/chat#joinRoom-', room);
			socket.join(room);
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
          room
				});
				await chat.save();
				chatting.to(room).emit('sendMessage', { name, message });
			} catch (err) {
				console.log('💚/chat#sendMessage- err: ', err.message);
			}
		});
		// 💚/chat#getAllMessages - 모든 메시지 조회
		socket.on('getAllMessages', async () => {
			console.log('💚/chat#getAllMessages-');
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
			console.log(chats.map(el => el.text));
			chatting.to(room).emit('getAllMessages', chats);
		});
	});
} catch (err) {
	console.log('💚/chat#getAllMessages- err: ', err.message);
}

module.exports = server;
