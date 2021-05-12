import { Request, Response } from 'express';

const deleteComment = async (req: Request, res: Response) => {
	// 댓글 삭제
	console.log('💜deleteComment- ', req.body);
};

export default deleteComment;
