import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { Projects } from '../../src/entity/Projects';
import { Rooms } from '../../src/entity/Rooms';

const createChatRoom = async (req: Request, res: Response) => {
	// 채팅방 생성
	console.log('💚createChatRoom-', req.body, req.params);
	const { name } = req.body;
	const { projectURL } = req.params;
	// 프로젝트 정보 가져오기
	const foundProject = await Projects.findOne({
		where: {
			projectURL,
		},
	});
	if (foundProject) {
		let foundRoom = await getRepository(Rooms).findOne({
			relations: ['project'],
			where: {
				name,
				project: foundProject,
			},
		});
		if (foundRoom) {
			// 이미 같은 이름 있음 -> 생성 불가
			console.log('💚createChatRoom-err:', name, 'room is already existed');
			res.status(400).json({
				message: name + ' room is already existed',
			});
		} else {
			// 새로운 채팅방 생성
			let newRoom = await Rooms.create({
				name,
				project: foundProject,
			});
			await newRoom.save();
			console.log('💚createChatRoom-result:', newRoom);
			res.status(200).json({
				...newRoom,
			});
		}
	}
};

export default createChatRoom;
