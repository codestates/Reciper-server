import { Request, Response } from 'express';
import { Projects } from '../../src/entity/Projects';

const showProject = async (req: Request, res: Response) => {
	// 프로젝트 조회
	console.log('💛showProject- ');
	console.log(req.body, req.params);
	const projectURL = req.params.projectURL;
	try {
		const foundProject = await Projects.findOne({
			relations: ['members'],
			where: {
				projectURL,
			},
		});
		if (foundProject) {
			console.log('💛showProject- result: ');
			console.log(foundProject); // test
			res.status(200).json({
				...foundProject,
				members: foundProject.members.map(el => el.id),
			});
		}
	} catch (err) {
		console.log('💛showProject- err: ', err.message);
		res.status(400).json({
			message: err.message,
		});
	}
};

export default showProject;
