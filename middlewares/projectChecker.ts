import { Request, Response, NextFunction } from 'express';
import { Projects } from '../src/entity/Projects';
import getMemberInfo from './getMemberInfo';

const projectChecker = async (req: Request, res: Response, next: NextFunction) => {
	console.log('🔐projectChecker-start');
	const userId = req.userId as number;
	const projectURL = req.params.projectURL;
	getMemberInfo(userId, projectURL)
		.then(result => {
			const { projectId } = result;
			console.log('🔐projectChecker-go next function!!\n');
			next();
		})
		.catch(err => {
			console.log('🔐projectChecker-err:', err.message);
			res.status(400).json({
				message: err,
			});
			//next(new Error());
		});
};

export default projectChecker;
