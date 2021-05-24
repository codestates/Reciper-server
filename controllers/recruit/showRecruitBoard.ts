import { Request, Response } from 'express';
import { Recruits } from './../../src/entity/Recruits';
import { getRepository } from 'typeorm';
import { Recruit_comments } from './../../src/entity/Recruit_comments';

const showRecruitBoard = async (req: Request, res: Response) => {
	// 팀원모집 게시글 상세내용 조회
	console.log('💜showRecruitBoard-');
	console.log(req.body, req.params);
	// 저장된 게시글 정보 불러오기
	const boardId = Number(req.params.board_id);
	let boardInfo;
	try {
		boardInfo = await getRepository(Recruits).findOne({
			relations: ['writer', 'stacks'],
			where: {
				id: boardId,
			},
		});
		console.log(boardInfo);
	} catch (err) {
		console.log('💜showRecruitBoard-err:', err.message);
	}
	if (boardInfo === undefined) {
		res.status(400).json({
			message: 'no data about board ' + boardId,
		});
	} else {
		// stack 데이터 가져오기
		const stackArray: any = [];
		boardInfo.stacks.map(stack => {
			stackArray.push(stack.name);
		});
		// view 1 증가
		boardInfo.view += 1;
		try {
			boardInfo.save();
		} catch (err) {
			console.log('💜showRecruitBoard-err:', err.message);
		}
		// 댓글 개수 세기 + 댓글 전체 데이터 가져오기
		const commentsList = await getRepository(Recruit_comments).find({
			relations: ['writer'],
			where: {
				recruitBoard: {
					id: boardId,
				},
			},
		});
		// 데이터 보내기
		console.log(
			'💜showRecruitBoard-result:',
			{
				id: boardInfo.id,
				name: boardInfo.name,
			},
			commentsList.map(el => el.id),
		); // test
		res.status(200).json({
			...boardInfo,
			recruitMembers: JSON.parse(boardInfo.recruitMembers),
			requireStack: stackArray,
			commentsList,
		});
	}
};

export default showRecruitBoard;
