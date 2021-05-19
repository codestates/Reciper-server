import { Request, Response } from 'express';
import { Projects } from '../../src/entity/Projects';
import randomColorGenerator from '../login/randomColorGenerator';

const editProject = async (req: Request, res: Response) => {
	// 프로젝트 수정
	console.log('💛editProject- ');
	console.log(req.body, req.params);
	const { name, projectURL } = req.body;
	const nowProjectURL = req.params.projectURL;
	try {
		const foundProject = await Projects.findOne({
			where: {
				projectURL: nowProjectURL,
			},
		});
		if (foundProject) {
			foundProject.name = name;
			foundProject.projectURL = projectURL;
			foundProject.projectColor = randomColorGenerator();
			await foundProject.save();
			console.log(foundProject); // test
			res.status(200).json({
				...foundProject,
			});
		}
	} catch (err) {
		console.log('💛editProject- err: ', err.message);
		res.status(400).json({
			message: err.message,
		});
	}
};

export default editProject;
