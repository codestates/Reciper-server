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
			// 프로젝트 정보 수정해서 저장하기
			foundProject.name = name;
			foundProject.projectURL = projectURL;
			foundProject.projectColor = randomColorGenerator();
			await foundProject.save();
			console.log('💛editProject- result: ');
			console.log(foundProject); // test
			res.status(200).json({
				...foundProject,
				members: foundProject.members.map(el => el.id),
			});
		}
	} catch (err) {
		// projectURL에 중복된 value를 저장하면 에러 발생
		console.log('💛editProject- err: ', err.message);
		res.status(400).json({
			message: err.message,
		});
	}
};

export default editProject;
