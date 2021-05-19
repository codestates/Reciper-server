import app from './app';
import * as dotenv from 'dotenv';
dotenv.config();
const http = require('http');
const server = http.createServer(app);
const io_s = require('socket.io');
const io = io_s(server);
const { createClient } = require('redis');
const redisAdapter = require('@socket.io/redis-adapter');

const pubClient = createClient({
	host: process.env.REDIS_HOST,
	port: process.env.REDIS_PORT,
	password: process.env.REDIS_PASSWORD,
});
const subClient = pubClient.duplicate();

io.adapter(redisAdapter(pubClient, subClient));

const chat = io.of('/chat');
chat.on(
	'connection',
	(socket: { on: (arg0: string, arg1: ({ name, message }: { name: any; message: any }) => void) => void }) => {
		console.log('connection');
		socket.on('message', ({ name, message }) => {
			console.log(name, message);
			chat.emit('message', { name, message });
		});
	},
);

module.exports = server;
