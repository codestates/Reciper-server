import { Request, Response } from 'express';
import { Projects } from '../../src/entity/Projects';

const deleteProject = async (req: Request, res: Response) => {
	// 프로젝트 삭제
	console.log('💛deleteProject- ');
	console.log(req.body, req.params);
	const projectURL = req.params.projectURL;
	try {
		const foundProject = await Projects.findOne({
			projectURL,
		});
		if (foundProject) {
			const delProject = await Projects.delete({
				projectURL,
			});
			console.log(delProject); // test
			res.status(200).json({
				message: 'delete success project ' + projectURL,
			});
		} else {
			res.status(400).json({
				message: projectURL + ' project is not found',
			});
		}
	} catch (err) {
		console.log('💛deleteProject- err: ', err.message);
		res.status(400).json({
			message: 'delete error ' + err.message,
		});
	}
};

export default deleteProject;
