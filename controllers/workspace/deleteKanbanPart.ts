import { Request, Response } from 'express';
import { Parts } from '../../src/entity/Parts';
import { getRepository } from 'typeorm';
import { getPartsList } from './showKanbanParts';

const deleteKanbanPart = async (req: Request, res: Response) => {
	// part 삭제
	console.log('💚deleteKanbanPart-', req.params);
	const { projectURL, part } = req.params;
	let foundParts = await getRepository(Parts).find({
		relations: ['project'],
		where: {
			title: part,
		},
		order: {
			index: 'ASC',
		},
	});
	if (foundParts.length > 0) {
		let curIndex = 0;
		for (let idx = 0; idx < foundParts.length; idx++) {
			if (foundParts[idx].doingProject.projectURL === projectURL) {
				// Part 삭제
				curIndex = idx;
				await foundParts[idx].remove();
			} else if (foundParts[idx].index > curIndex) {
				foundParts[idx].index--;
				await foundParts[idx].save();
			}
		}
		getPartsList(projectURL)
			.then(partsList => {
				console.log('💚deleteKanbanPart-result:', partsList); // test
				res.status(200).json({
					partsList,
				});
			})
			.catch(err => {
				console.log('💚deleteKanbanPart-err:', err.message);
				res.status(400).json({
					message: err.message,
				});
			});
	} else {
		console.log('💚deleteKanbanPart-err:', part, 'is not existed');
		res.status(400).json({
			message: part + ' is not existed',
		});
	}
};

export default deleteKanbanPart;
