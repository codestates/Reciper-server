import { Request, Response } from 'express';

const showProjectList = async (req: Request, res: Response) => {
	// 프로젝트 리스트 조회
	console.log('💛showProjectList- ');
	console.log(req.body, req.params);
};

export default showProjectList;
