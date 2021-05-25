import { Request, Response } from 'express';
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
};

export default createChatRoom;
