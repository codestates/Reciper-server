import { Request, Response } from 'express';

const addMembers = async (req: Request, res: Response) => {
	// 프로젝트 참가(팀원 초대 응답)
	console.log('💛addMembers- ');
	console.log(req.body, req.params);
};

export default addMembers;
