import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { Rooms } from '../../src/entity/Rooms';
import { getRoomsList } from './showChatRooms';

const editChatRoom = async (req: Request, res: Response) => {
	// 채팅방 이름 수정
	console.log('💚editChatRoom-', req.body, req.params);
	const { name } = req.body;
	const { projectURL, room } = req.params;
	let foundRoom = await getRepository(Rooms).find({
		relations: ['project'],
		where: {
			name: room,
		},
	});
	if (foundRoom.length > 0) {
		for (let idx = 0; idx < foundRoom.length; idx++) {
			if (foundRoom[idx].project.projectURL === projectURL) {
				// 새로운 이름으로 저장
				foundRoom[idx].name = name;
				await foundRoom[idx].save();
				break;
			}
		}
		getRoomsList(projectURL)
			.then(roomsList => {
				console.log('💚editChatRoom-result:', roomsList); // test
				res.status(200).json({
					roomsList,
				});
			})
			.catch(err => {
				console.log('💚editChatRoom-err:', err.message);
				res.status(400).json({
					message: err.message,
				});
			});
	} else {
		console.log('💚editChatRoom-err:', room, 'is not existed');
		res.status(400).json({
			message: room + ' is not existed',
		});
	}
};

export default editChatRoom;
