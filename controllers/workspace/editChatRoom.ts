import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { Rooms } from '../../src/entity/Rooms';
import { getRoomsList } from './showChatRooms';

const editChatRoom = async (req: Request, res: Response) => {
	// 채팅방 이름 수정
	console.log('💚editChatRoom-', req.body, req.params);
	const { name } = req.body;
	const { projectURL, room } = req.params;
	let foundRooms = await getRepository(Rooms).find({
		relations: ['project'],
		where: {
			name: room,
		},
	});
	let chkRooms = await getRoomsList(projectURL);
	console.log(chkRooms);
	if (foundRooms.length > 0) {
		for (let idx = 0; idx < foundRooms.length; idx++) {
			if (foundRooms[idx].project.projectURL === projectURL) {
				if (!chkRooms.includes(name)) {
					// 새로운 이름으로 저장
					foundRooms[idx].name = name;
					await foundRooms[idx].save();
					break;
				} else {
					console.log('💚editChatRoom-err:', name, 'room is already existed');
					res.status(400).json({
						message: name + ' room is already existed',
					});
					return;
				}
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
