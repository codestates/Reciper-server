import { Request, Response, NextFunction } from 'express';
import { Projects } from '../src/entity/Projects';

const memberChecker = async (req: Request, res: Response, next: NextFunction) => {
	console.log('🔐memberChecker 실행합니다- ', req.userId, req.params);
	const userId = req.userId;
	const projectURL = req.params.projectURL;
	try {
		// 프로젝트 찾기
		const foundProject = await Projects.findOne({
			relations: ['members'],
			where: {
				projectURL,
			},
		});
		if (userId && foundProject) {
			// 프로젝트 멤버인지 확인
			const chkMembers = foundProject.members.map(el => el.id);
			//console.log(projectURL, ' member: ', chkMembers); // test
			if (chkMembers.includes(userId)) {
				console.log('🔐memberChecker 결과- ', userId, 'is member in', projectURL);
				// 실제 요청으로 넘어감
				console.log('🔐go next function!!\n');
				next();
			} else {
				console.log('🔐memberChecker- err: ', userId, ' is not member in ', projectURL);
				res.status(400).json({
					message: userId + ' is not member in ' + projectURL,
				});
				return;
			}
		} else {
			console.log('🔐memberChecker- err: ', projectURL, ' project is not found');
			res.status(400).json({
				message: projectURL + ' project is not found',
			});
			return;
		}
	} catch (err) {
		console.log('🔐memberChecker- err: ', err.message);
		res.status(400).json({
			message: err.message,
		});
		return;
	}
};

export default memberChecker;
