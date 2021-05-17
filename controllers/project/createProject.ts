import { Request, Response } from 'express';

const createProject = async (req: Request, res: Response) => {
	// 프로젝트 생성
	console.log('💛createProject- ');
	console.log(req.body, req.params);
};

export default createProject;
