import { Request, Response } from 'express';
import { Rooms } from '../../src/entity/Rooms';

const editChatRoom = async (req: Request, res: Response) => {
	// 채팅방 이름 수정
	console.log('💚editChatRoom-', req.body, req.params);
	const { name } = req.body;
	const { projectURL, room } = req.params;
	let foundRoom = await Rooms.findOne({
		where: {
			name: room,
		},
	});
	if (foundRoom) {
		// 새로운 이름으로 저장
		foundRoom.name = name;
		await foundRoom.save();
		console.log('💚editChatRoom-result:', foundRoom);
		res.status(200).json({
			...foundRoom,
		});
	} else {
		console.log('💚editChatRoom-err:', room, 'is not existed');
		res.status(400).json({
			message: room + ' is not existed',
		});
	}
};

export default editChatRoom;
