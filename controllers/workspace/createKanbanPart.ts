import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { Parts } from '../../src/entity/Parts';
import { Projects } from '../../src/entity/Projects';
import { getPartsList } from './showKanbanParts';

const createKanbanPart = async (req: Request, res: Response) => {
	// part 생성
	console.log('💚createKanbanPart-', req.body, req.params);
	const { title } = req.body;
	const { projectURL } = req.params;
	// 프로젝트 정보 가져오기
	const foundProject = await Projects.findOne({
		where: {
			projectURL,
		},
	});
	if (foundProject) {
		// part 데이터 가져오기
		let foundPart = await getRepository(Parts).findOne({
			relations: ['project'],
			where: {
				title,
				project: foundProject,
			},
		});
		if (foundPart) {
			// 이미 같은 이름 있음 -> 생성 불가
			console.log('💚createChatPart-err:', title, 'part is already existed');
			res.status(400).json({
				message: title + ' part is already existed',
			});
		} else {
			// 새로운 part 생성
			let countParts = await Parts.find({ where: { doingProject: foundProject } });
			let index = countParts.length; // part의 최대길이만큼 다음index에 추가
			let newPart = await Parts.create({
				title,
				doingProject: foundProject,
				index,
			});
			await newPart.save();
			getPartsList(projectURL)
				.then(partsList => {
					console.log('💚createKanbanPart-result:', partsList); // test
					res.status(200).json({
						partsList,
					});
				})
				.catch(err => {
					console.log('💚createKanbanPart-err:', err.message);
					res.status(400).json({
						message: err.message,
					});
				});
		}
	}
};

export default createKanbanPart;
