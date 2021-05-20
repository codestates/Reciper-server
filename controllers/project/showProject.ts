import { Request, Response } from 'express';

const showProject = async (req: Request, res: Response) => {
	// 프로젝트 조회
	console.log('💛showProject- ');
	console.log(req.body, req.params);
};

export default showProject;
