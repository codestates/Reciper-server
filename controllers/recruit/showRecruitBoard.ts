import { Request, Response } from 'express';

const showRecruitBoard = async (req: Request, res: Response) => {
	// 팀원모집 게시글 상세내용 조회
	console.log('💜showRecruitBoard- ', req.body);
};

export default showRecruitBoard;
