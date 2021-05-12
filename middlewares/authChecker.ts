import { Request, Response, NextFunction } from 'express';

const authChecker = async (req: Request, res: Response, next: NextFunction) => {
	console.log('🔒authChecker 실행합니다 - headers:\n', req.headers, '\n');
};

export default authChecker;
