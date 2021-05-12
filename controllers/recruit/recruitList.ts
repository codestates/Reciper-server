import { Request, Response } from 'express';

const recruitList = async (req: Request, res: Response) => {
	// 팀원모집 게시글 리스트 조회
	console.log('💜recruitList- ', req.body);
};

export default recruitList;
