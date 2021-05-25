import { Request, Response } from 'express';
import { Rooms } from '../../src/entity/Rooms';

const deleteChatRoom = async (req: Request, res: Response) => {
	// 채팅방 삭제
	console.log('💚deleteChatRoom-', req.body, req.params);
	const { projectURL, room } = req.params;
	let foundRoom = await Rooms.findOne({
		relations: ['project'],
		where: {
			name: room,
			project: {
				projectURL,
			},
		},
	});
	if (foundRoom) {
		// 방 삭제
		const result = await foundRoom.remove();
		console.log('💚deleteChatRoom-result:', result);
		res.status(200).json({
			message: 'delete success room ' + room,
		});
	} else {
		console.log('💚deleteChatRoom-err:', room, 'is not existed');
		res.status(400).json({
			message: room + ' is not existed',
		});
	}
};

export default deleteChatRoom;
