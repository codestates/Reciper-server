import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { Projects } from '../../src/entity/Projects';
import { Rooms } from '../../src/entity/Rooms';

const showChatRooms = async (req: Request, res: Response) => {
	// 채팅방 목록 조회
	console.log('💚showChatRooms-', req.body, req.params);
	const { projectURL } = req.params;
	getRoomsList(projectURL)
		.then(roomsList => {
			console.log('💚showChatRooms-result:', roomsList); // test
			res.status(200).json({
				roomsList,
			});
		})
		.catch(err => {
			console.log('💚showChatRooms-err:', err.message);
			res.status(400).json({
				message: err.message,
			});
		});
};

const getRoomsList = async (projectURL: string) => {
	// 채팅방 목록을 배열 형태로 만들기
	console.log('💚getRoomsList-', projectURL);
	const foundProject = await Projects.find({
		where: {
			projectURL,
		},
	});
	console.log(foundProject);
	const allChatRooms = await getRepository(Rooms).find({
		relations: ['project'],
		order: {
			createdAt: 'ASC', // 채팅방 생성 순서
		},
	});
	let roomsList = [];
	for (let idx = 0; idx < allChatRooms.length; idx++) {
		if (allChatRooms[idx].project.projectURL === projectURL) {
			roomsList.push(allChatRooms[idx].name);
		}
	}
	return roomsList;
};

export { showChatRooms, getRoomsList };
