import { Request, Response } from 'express';
import { Recruits } from '../../src/entity/Recruits';
import { Recruit_comments } from '../../src/entity/Recruit_comments';
import { Users } from '../../src/entity/Users';
import { getRepository } from 'typeorm';

const registerComment = async (req: Request, res: Response) => {
	// 댓글 등록
	console.log('💜registerComment- ');
	console.log(req.body, req.params);
	const boardId = Number(req.params.board_id);
	const userId = req.userId;
	const { body } = req.body;
	//유저이름 탐색
	const foundUser = await Users.findOne({
		where: {
			id: userId,
		},
	});
	if (foundUser) {
		const foundBoard = await getRepository(Recruits).findOne({
			relations: ['writer'],
			where: {
				id: boardId,
			},
		});
		if (foundBoard) {
			const created = await Recruit_comments.create({
				body,
				recruitBoard: foundBoard,
				writer: foundUser,
			});
			// if (foundUser.commentsList === undefined) {
			// 	foundUser.commentsList = [];
			// }
			// foundUser.commentsList = [...foundUser.commentsList, created];
			// console.log(foundUser.commentsList);
			// await foundUser.save();
			foundBoard.commentCount++;
			if (foundBoard.stacks === undefined) {
				foundBoard.stacks = [];
			}
			await foundBoard.save();
			await created.save();
			const commentsList = await getRepository(Recruit_comments).find({
				relations: ['writer'],
				where: {
					recruitBoard: foundBoard,
				},
			});
			console.log(commentsList); // test
			res.status(200).json({
				...foundBoard,
				recruitMembers: JSON.parse(foundBoard.recruitMembers),
				requireStack: foundBoard.stacks.map(el => el.name),
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
