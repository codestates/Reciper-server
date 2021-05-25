import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { Rooms } from '../../src/entity/Rooms';

const showChatRooms = async (req: Request, res: Response) => {
	// 채팅방 목록 조회
	console.log('💚showChatRooms-', req.body, req.params);
	const { projectURL } = req.params;
	const allChatRooms = await getRepository(Rooms).find({
		relations: ['project'],
		where: {
			project: {
				projectURL,
			},
		},
	});
	let roomsList = [];
	for (let idx = 0; idx < allChatRooms.length; idx++) {
		let obj = { name: allChatRooms[idx].name };
		roomsList.push(obj);
	}
	console.log('💚showChatRooms-result:', roomsList); // test
	res.status(200).json({
		roomsList,
	});
};

export default showChatRooms;
