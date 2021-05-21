import { Request, Response, NextFunction } from 'express';

const memberChecker = async (req: Request, res: Response, next: NextFunction) => {
	console.log('🔐memberChecker 실행합니다- headers:\n', req.userId, req.params, '\n-------------\n');
	// 실제 요청으로 넘어감
	console.log('🔐go next function!!\n\n');
	next();
};

export default memberChecker;
