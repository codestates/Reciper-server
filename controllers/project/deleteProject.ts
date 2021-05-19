import { Request, Response } from 'express';

const deleteProject = async (req: Request, res: Response) => {
	// 프로젝트 삭제
	console.log('💛deleteProject- ');
	console.log(req.body, req.params);
};

export default deleteProject;
