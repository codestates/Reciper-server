import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { Rooms } from '../../src/entity/Rooms';
import { Chats } from '../../src/entity/Chats';
import { Projects } from '../../src/entity/Projects';
import { FindConditions } from '../../node_modules/typeorm/find-options/FindConditions';
const deleteProject = async (req: Request, res: Response) => {
	// 프로젝트 삭제
	console.log('💛deleteProject-');
	console.log(req.body, req.params);
	const projectURL = req.params.projectURL;
	try {
		const foundProject = await Projects.findOne({
			projectURL,
		});
		if (foundProject) {
			// parts, task_boxes, tasks, task_comments 정보 삭제
			// rooms 정보 삭제
			const delRooms = await getRepository(Rooms).find({
				relations: ['project'],
				where: {
					project: foundProject,
				},
			});
			await delRooms.forEach(el => el.remove());
			// chats 정보 삭제
			const foundChats = await getRepository(Chats).find({
				join: {
					alias: 'chats',
					innerJoin: {
						users: 'chats.project',
					},
				},
				where: (qb: any) => {
					qb.where({
						// Filter Role fields
						project: foundProject,
					});
				},
			});
			for (let i = 0; i < foundChats.length; i++) {
				await foundChats[i].remove();
				// console.log(foundChats[i], '댓글 삭제 완료');
			}
			// 프로젝트 삭제
			const delProject = await Projects.delete({
				projectURL,
			});
			console.log('💛deleteProject-result:', delProject); // test
			res.status(200).json({
				message: 'delete success project ' + projectURL,
			});
		} else {
			console.log('💛deleteProject-err:', projectURL, 'project is not found');
			res.status(400).json({
				message: projectURL + ' project is not found',
			});
		}
	} catch (err) {
		console.log('💛deleteProject-err:', err.message);
		res.status(400).json({
			message: 'delete error ' + err.message,
		});
	}
};

export default deleteProject;
