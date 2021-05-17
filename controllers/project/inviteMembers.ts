import { Request, Response } from 'express';

const inviteMembers = async (req: Request, res: Response) => {
	// 프로젝트 팀원 초대
	console.log('💛inviteMembers- ');
	console.log(req.body, req.params);
};

export default inviteMembers;
