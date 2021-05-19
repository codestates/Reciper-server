import app from './app';
import * as dotenv from 'dotenv';
import { Projects } from './src/entity/Projects';
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
	console.log('redis pub/sub setting done');

	io.adapter(redisAdapter(pubClient, subClient));
	const project = io.of(`/project`);
	// room 개념을썻을때 ,redis의 pub/sub이 안먹어서 서로 통신이 두절되는게 확인됬다.
	// 추후 생각해보자 ( advanced의 채팅방,DM기능 )

	project.use(
		async (socket: { handshake: { query: { projectURL: string } } }, next: (arg0?: undefined | Error) => void) => {
			if (await Projects.findOne({ where: { projectURL: socket.handshake.query.projectURL } })) {
				// db조회해서 존재하는지 확인 조건 ⬆️
				console.log('정상 처리');
				next();
			} else {
				console.log('비정상 처리');
				next(new Error());
			}
		},
	);
	project.on(
		'connection',
		(socket: {
			handshake: { query: { projectURL: any } };
			on: (arg0: string, arg1: ({ name, message }: { name: any; message: any }) => void) => void;
		}) => {
			// console.log('connection');
			socket.on('message', ({ name, message }) => {
				console.log(name, message);
				project.emit('message', { name, message });
			});
		},
	);
} catch (err) {
	console.log(err);
}

module.exports = server;
