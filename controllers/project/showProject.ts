import { Request, Response } from 'express';
import { Projects } from '../../src/entity/Projects';

const showProject = async (req: Request, res: Response) => {
	// 프로젝트 조회
	console.log('💛showProject-', req.params);
	const projectURL = req.params.projectURL;
	try {
		const foundProject = await Projects.findOne({
			relations: ['members'],
			where: {
				projectURL,
			},
		});
		if (foundProject) {
			console.log('💛showProject-result: ', {
				...foundProject,
				members: foundProject.members.map(el => {
					return {
						id: el.id,
						name: el.name,
					};
				}),
			}); // test
			res.status(200).json({
				...foundProject,
			});
		}
	} catch (err) {
		console.log('💛showProject-err:', err.message);
		res.status(400).json({
			message: err.message,
		});
	}
};

export default showProject;
