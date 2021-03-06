import app from './app';
import { Socket } from './node_modules/socket.io/dist/socket';
import workspaceChecker from './middlewares/workspaceChecker';
import socketChat from './controllers/workspace/socketChat';
import socketKanban from './controllers/workspace/socketKanban';
import socketWebRTC from './controllers/workspace/socketWebRTC';
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
	console.log('π redis pub/sub setting done');

	io.adapter(redisAdapter(pubClient, subClient));

	// TODO: chat κΈ°λ₯ socket ν΅μ 
	const chatIo = io.of(/^\/chat\/\w{4,20}$/); // dynamic namespace(/chat/projectURL)
	chatIo.use(workspaceChecker);
	chatIo.on('connection', (socket: Socket) => {
		console.log('π/chat#connection\n', socket.handshake.query);
		const projectChatIo = chatIo.nsp;
		app.set('chatIo', projectChatIo);
		socketChat(socket);
	});

	// TODO: kanban κΈ°λ₯ socket ν΅μ 
	const kanbanIo = io.of(/^\/kanban\/\w{4,20}$/); // dynamic namespace(/kanban/projectURL)
	kanbanIo.use(workspaceChecker);
	kanbanIo.on('connection', (socket: Socket) => {
		console.log('π/kanban#connection\n', socket.handshake.query);
		const projectKanbanIo = kanbanIo.nsp;
		app.set('kanbanIo', projectKanbanIo);
		socketKanban(socket);
		socket.emit('connection');
	});

	// TODO: WebRTC κΈ°λ₯ socket ν΅μ 
	const webRTCIo = io.of(/^\/webRTC\/\w{4,20}$/); // dynamic namespace(/webRTC/projectURL)
	webRTCIo.use(workspaceChecker);
	webRTCIo.on('connection', (socket: Socket) => {
		console.log('π/webRTC#connection\n', socket.handshake.query);
		const projectWebRTCIo = webRTCIo.nsp;
		app.set('webRTCIo', projectWebRTCIo);
		socketWebRTC(socket);
		console.log(socket.handshake.query);
		socket.emit('connection');
	});
} catch (err) {
	console.log('π redis pub/sub-err:', err.message);
}

module.exports = server;
