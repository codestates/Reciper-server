import { Request, Response } from 'express';

const editRecruitBoard = async (req: Request, res: Response) => {
	// 팀원모집 게시글 수정
	console.log('💜editRecruitBoard- ', req.body, req.params);
};

export default editRecruitBoard;
