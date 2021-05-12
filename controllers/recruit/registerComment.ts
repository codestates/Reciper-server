import { Request, Response } from 'express';

const registerComment = async (req: Request, res: Response) => {
	// 댓글 등록
	console.log('💜registerComment- ', req.body);
};

export default registerComment;
