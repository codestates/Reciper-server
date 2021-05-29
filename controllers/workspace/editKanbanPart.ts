import { Request, Response } from 'express';
import { Parts } from '../../src/entity/Parts';
import { getRepository } from 'typeorm';
import { getPartsList } from './showKanbanParts';

const editKanbanPart = async (req: Request, res: Response) => {
	// part 이름 수정
	console.log('💚editKanbanPart-', req.body, req.params);
	const { name } = req.body;
	const { projectURL, part } = req.params;
	// 해당 Part 찾기(같은 이름을 가진 모든 Part 데이터)
	let foundParts = await getRepository(Parts).find({
		relations: ['doingProject'],
		where: {
			name: part,
		},
	});
	if (foundParts.length > 0) {
		for (let idx = 0; idx < foundParts.length; idx++) {
			if (foundParts[idx].doingProject.projectURL === projectURL) {
				let chkRooms = await getPartsList(projectURL);
				if (!chkRooms.includes(name)) {
					// 새로운 이름으로 저장
					foundParts[idx].name = name;
					await foundParts[idx].save();
					break;
				} else {
					console.log('💚editKanbanPart-err:', name, 'part is already existed');
					res.status(400).json({
						message: name + ' part is already existed',
					});
					return;
				}
			}
		}
		getPartsList(projectURL)
			.then(roomsList => {
				console.log('💚editKanbanPart-result:', roomsList); // test
				res.status(200).json({
					roomsList,
				});
			})
			.catch(err => {
				console.log('💚editKanbanPart-err:', err.message);
				res.status(400).json({
					message: err.message,
				});
			});
	} else {
		console.log('💚editKanbanPart-err:', part, 'is not existed');
		res.status(400).json({
			message: part + ' is not existed',
		});
	}
};

export default editKanbanPart;
