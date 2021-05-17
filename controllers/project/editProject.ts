import { Request, Response } from 'express';

const editProject = async (req: Request, res: Response) => {
	// 프로젝트 수정
	console.log('💛editProject- ');
	console.log(req.body, req.params);
};

export default editProject;
