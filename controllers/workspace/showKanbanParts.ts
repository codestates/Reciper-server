//showKanbanParts
import { Request, Response } from 'express';
import { Parts } from '../../src/entity/Parts';
import { Projects } from '../../src/entity/Projects';
import { getRepository } from 'typeorm';

const showKanbanParts = async (req: Request, res: Response) => {
	// part 목록 조회
	console.log('💚showKanbanParts-', req.params);
	const { projectURL } = req.params;
	getPartsList(projectURL)
		.then(roomsList => {
			res.status(200).json({
				roomsList,
			});
		})
		.catch(err => {
			console.log('💚showKanbanParts-err:', err.message);
			res.status(400).json({
				message: err.message,
			});
		});
};

const getPartsList = async (projectURL: string) => {
	// part 목록을 배열 형태로 만들기
	console.log('💚💚getPartList-', projectURL);
	const foundProject = await Projects.find({
		where: {
			projectURL,
		},
	});
	const allPartRooms = await getRepository(Parts).find({
		relations: ['doingProject'],
		order: {
			createdAt: 'ASC', // 파트 생성 순서
		},
	});
	let roomsList = [];
	for (let idx = 0; idx < allPartRooms.length; idx++) {
		if (allPartRooms[idx].doingProject.projectURL === projectURL) {
			roomsList.push(allPartRooms[idx].name);
		}
	}
	return roomsList;
};

export { showKanbanParts, getPartsList };
