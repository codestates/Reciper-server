import { Request, Response } from 'express';
import { Recruits } from './../../src/entity/Recruits';
import { Stacks } from '../../src/entity/Stacks';
import { getRepository } from 'typeorm';
import { Recruit_comments } from './../../src/entity/Recruit_comments';

const deleteRecruitBoard = async (req: Request, res: Response) => {
	// 팀원모집 게시글 삭제
	console.log('💜deleteRecruitBoard- ', req.body, req.params);
	const boardId = Number(req.params.board_id);
	// join 테이블에서 해당 게시글과 관련된 데이터(stack) 지우기

	// 해당 게시글과 관련된 댓글 삭제하기
	try {
		const deleteComments = await getRepository(Recruit_comments).find({
			relations: ['recruits'],
			where: {
				recruits: {
					id: boardId,
				},
			},
		});
		for (let idx = 0; idx < deleteComments.length; idx++) {
			await getRepository(Recruit_comments).remove(deleteComments[idx]);
		}
	} catch (err) {
		console.log('💜deleteRecruitBoard- err: ', err.message);
		res.status(400).json({
			message: 'delete error ' + err.message,
		});
	}
	// 해당 게시글 삭제하기
	try {
		const deleteBoard = await Recruits.delete({
			id: boardId,
		});
	} catch (err) {
		console.log('💜deleteRecruitBoard- err: ', err.message);
		res.status(400).json({
			message: 'delete error ' + err.message,
		});
	}
	// 삭제 성공 응답 보내기
	res.status(200).json({
		message: 'delete success board ' + boardId,
	});
};

export default deleteRecruitBoard;
