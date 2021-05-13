import { Request, Response } from 'express';
import { Recruits } from '../../src/entity/Recruits';
import { Recruit_comments } from '../../src/entity/Recruit_comments';
import { Users } from '../../src/entity/Users';

const registerComment = async (req: Request, res: Response) => {
	// 댓글 등록
	console.log('💜registerComment- ', req.body);
	const { board_id } = req.params;
	console.log(req.params);
	const { userEmail, userId } = req;
	const { body } = req.body;
	//유저이름 탐색
	const foundUser = await Users.findOne({ where: { id: userId } });
	if (foundUser) {
		const name = foundUser.name;
		console.log(1);
		const foundBoard = await Recruits.findOne({ where: { id: Number(board_id) } });
		console.log(foundBoard);
		if (foundBoard) {
			const created = await Recruit_comments.create({ writer: name, writer_id: userId, body, recruits: foundBoard });
			created.save();
			const allComments = await Recruit_comments.find({ where: { recruits: foundBoard }, order: { createdAt: 'ASC' } });
			res.status(200).json({ message: 'done', allComments });
		} else {
			res.status(400).json({ message: 'recruit_board is not found' });
		}
	} else {
		res.status(400).json({ message: 'user is not found' });
	}
};

export default registerComment;
