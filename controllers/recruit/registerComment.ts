import { Request, Response } from 'express';
import { Recruits } from '../../src/entity/Recruits';
import { Recruit_comments } from '../../src/entity/Recruit_comments';
import { Users } from '../../src/entity/Users';

const registerComment = async (req: Request, res: Response) => {
	// 댓글 등록
	console.log('💜registerComment- ');
	console.log(req.body, req.params);
	const boardId = req.params.board_id;
	const userId = req.userId;
	const { body } = req.body;
	//유저이름 탐색
	const foundUser = await Users.findOne({
		where: {
			id: userId,
		},
	});
	if (foundUser) {
		const name = foundUser.name;
		const foundBoard = await Recruits.findOne({
			where: {
				id: Number(boardId),
			},
		});
		console.log(foundBoard);
		if (foundBoard) {
			const created = await Recruit_comments.create({
				writer: name,
				writerId: userId,
				body,
				recruitBoard: foundBoard,
			});
			await created.save();
			const commentsList = await Recruit_comments.find({
				where: {
					recruitBoard: foundBoard,
				},
				order: {
					createdAt: 'ASC',
				},
			});
			console.log(commentsList); // test
			res.status(200).json({
				...foundBoard,
				recruitMembers: JSON.parse(foundBoard.recruitMembers),
				requireStack: foundBoard.stacks,
				commentsList,
			});
		} else {
			res.status(400).json({
				message: 'recruit_board is not found',
			});
		}
	} else {
		res.status(400).json({
			message: 'user is not found',
		});
	}
};

export default registerComment;
