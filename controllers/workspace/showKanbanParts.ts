//showKanbanParts
import { Request, Response } from 'express';
import { Parts } from '../../src/entity/Parts';
import { Projects } from '../../src/entity/Projects';
import { getRepository } from 'typeorm';

const showKanbanParts = async (req: Request, res: Response) => {
	// part 목록 조회
	console.log('💚showKanbanParts-', req.body, req.params);
	const { projectURL } = req.params;
	getPartsList(projectURL)
		.then(partsList => {
			console.log('💚showKanbanParts-result:', partsList); // test
			res.status(200).json({
				partsList,
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
	console.log('💚getPartList-', projectURL);
	const foundProject = await Projects.find({
		where: {
			projectURL,
		},
	});
	console.log(foundProject);
	const allPartRooms = await getRepository(Parts).find({
		relations: ['project'],
		order: {
			createdAt: 'ASC', // 파트 생성 순서
		},
	});
	let partsList = [];
	for (let idx = 0; idx < allPartRooms.length; idx++) {
		if (allPartRooms[idx].doingProject.projectURL === projectURL) {
			partsList.push(allPartRooms[idx].title);
		}
	}
	return partsList;
};

export { showKanbanParts, getPartsList };
