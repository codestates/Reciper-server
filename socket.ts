import app from './app';
import { Socket } from './node_modules/socket.io/dist/socket';
import socketChat from './controllers/workspace/chat';
import socketKanban from './controllers/workspace/kanban';
import chatChecker from './middlewares/chatChecker';
import * as dotenv from 'dotenv';
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
	const chatIo = io.of('/chat');
	app.set('chatIo', chatIo);
	chatIo.use(chatChecker);
	chatIo.on('connection', (socket: Socket) => {
		console.log('💚/chat#connection\n', socket.handshake.query);
		socketChat(socket);
	});

	// TODO: kanban기능 socket 통신
	const kanbanIo = io.of('/kanban');
	app.set('kanbanIo', kanbanIo);
	kanbanIo.use(chatChecker);
	kanbanIo.on('connection', (socket: Socket) => {
		console.log('💚/kanban#connection\n', socket.handshake.query);
		socketKanban(socket);
	});
} catch (err) {
	console.log('💌 redis pub/sub-err:', err.message);
}

module.exports = server;
