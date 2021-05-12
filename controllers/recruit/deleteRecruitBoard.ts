import { Request, Response } from 'express';

const deleteRecruitBoard = async (req: Request, res: Response) => {
	// 팀원모집 게시글 삭제
	console.log('💜deleteRecruitBoard- ', req.body);
};

export default deleteRecruitBoard;
