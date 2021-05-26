import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { Rooms } from '../../src/entity/Rooms';
import { getRoomsList } from './showChatRooms';

const deleteChatRoom = async (req: Request, res: Response) => {
	// 채팅방 삭제
	console.log('💚deleteChatRoom-', req.body, req.params);
	const { projectURL, room } = req.params;
	let foundRooms = await getRepository(Rooms).find({
		relations: ['project'],
		where: {
			name: room,
		},
	});
	if (foundRooms.length > 0) {
		for (let idx = 0; idx < foundRooms.length; idx++) {
			if (foundRooms[idx].project.projectURL === projectURL) {
				// 방 삭제
				await foundRooms[idx].remove();
				break;
			}
		}
		getRoomsList(projectURL)
			.then(roomsList => {
				console.log('💚deleteChatRoom-result:', roomsList); // test
				res.status(200).json({
					roomsList,
				});
			})
			.catch(err => {
				console.log('💚deleteChatRoom-err:', err.message);
				res.status(400).json({
					message: err.message,
				});
			});
	} else {
		console.log('💚deleteChatRoom-err:', room, 'is not existed');
		res.status(400).json({
			message: room + ' is not existed',
		});
	}
};

export default deleteChatRoom;
