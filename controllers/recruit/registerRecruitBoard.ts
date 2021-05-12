import { Request, Response } from 'express';

const registerRecruitBoard = async (req: Request, res: Response) => {
	// 팀원모집 게시글 등록
	console.log('💜registerRecruitBoard- ', req.body);
};

export default registerRecruitBoard;
