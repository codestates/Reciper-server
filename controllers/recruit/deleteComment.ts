import { Request, Response } from 'express';
import { Recruits } from './../../src/entity/Recruits';
import { getRepository } from 'typeorm';
import { Recruit_comments } from './../../src/entity/Recruit_comments';

const deleteComment = async (req: Request, res: Response) => {
	// 댓글 삭제
	console.log('💜deleteComment-', req.params);
	const boardId = Number(req.params.board_id);
	const commentId = Number(req.params.comment_id);
	// 해당 게시글 찾기
	let boardInfo;
	try {
		boardInfo = await getRepository(Recruits).findOne({
			relations: ['writer', 'stacks'],
			where: {
				id: boardId,
			},
		});
	} catch (err) {
		console.log('💜showRecruitBoard-err:', err.message);
	}
	if (boardInfo === undefined) {
		console.log('💜deleteComment-err: no data about board', boardId);
		res.status(400).json({
			message: 'no data about board ' + boardId,
		});
	} else {
		// 게시글에서 해당 댓글 지우기
		const commentData = boardInfo.commentsList;
		if (commentData !== undefined) {
			for (let idx = 0; idx < commentData.length; idx++) {
				if (commentData[idx].id === commentId) {
					commentData.splice(idx, 1);
					boardInfo.commentCount -= 1;
					break;
				}
			}
		}
		try {
			if (boardInfo.stacks === undefined) {
				boardInfo.stacks = [];
			}
			boardInfo.save();
		} catch (err) {
			console.log('💜showRecruitBoard-err:', err.message);
		}
		// 데이터베이스에서 해당 댓글 지우기
		try {
			await Recruit_comments.delete({
				id: commentId,
			});
		} catch (err) {
			console.log('💜showRecruitBoard-err:', err.message);
		}
		// 지운 이후의 댓글 데이터 보내주기
		const commentsList = await getRepository(Recruit_comments).find({
			relations: ['writer'],
			where: {
				recruitBoard: {
					id: boardId,
				},
			},
		});
		if (boardInfo.recruitMembers) {
			boardInfo.recruitMembers = JSON.parse(boardInfo.recruitMembers);
		}
		res.status(200).json({
			...boardInfo,
			recruitMembers: boardInfo.recruitMembers,
			requireStack: boardInfo.stacks.map(el => el.name),
			commentsList,
		});
	}
};

export default deleteComment;
