import app from './app';
import * as dotenv from 'dotenv';
import { Projects } from './src/entity/Projects';
import { Chats } from './src/entity/Chats';
import { Users } from './src/entity/Users';
import { Socket } from './node_modules/socket.io/dist/socket';
import { getRepository } from 'typeorm';
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
	const project = io.of(`/project`);
	// room 개념을썻을때 ,redis의 pub/sub이 안먹어서 서로 통신이 두절되는게 확인됬다.
	// 추후 생각해보자 ( advanced의 채팅방,DM기능 )

	project.use(async (socket: Socket, next: (err?: Error) => void) => {
		if (await Projects.findOne({ where: { projectURL: socket.handshake.query.projectURL } })) {
			// db조회해서 존재하는지 확인 조건 ⬆️
			console.log('정상 처리');
			next();
		} else {
			console.log('비정상 처리');
			next(new Error());
		}
	});
	project.on('connection', (socket: Socket) => {
		// console.log('connection');
		socket.on('join_room', room => {
			console.log(room);
			socket.join(room);
		});
		socket.on('message', async ({ room, name, message }) => {
			console.log(room, name, message);
			let chat;
			const projects = await Projects.findOne({ where: { projectURL: socket.handshake.query.projectURL } });
			//a,b 로 하드코딩 되어있으나, 실제로 미들웨어를 이용해서 사용자정보를 조회한다.
			if (name === 'a') {
				const user = await Users.findOne({ where: { id: 1 } });
				chat = await Chats.create({ text: message, writer: user, project: projects, room });
			} else if (name === 'b') {
				const user = await Users.findOne({ where: { id: 2 } });
				chat = await Chats.create({ text: message, writer: user, project: projects, room });
			}
			chat?.save();
			project.to(room).emit('message', { name, message });
		});
		socket.on('totalMessageGet', async room => {
			const projects = await Projects.findOne({ where: { projectURL: socket.handshake.query.projectURL } });
			const chats = await getRepository(Chats).find({
				where: { project: projects, room },
				relations: ['writer'],
			});
			console.log(chats);
			project.to(room).emit('totalMessageGet', chats);
		});
	});
} catch (err) {
	console.log(err);
}

module.exports = server;
