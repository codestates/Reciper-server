import { Request, Response } from 'express';
import { Recruits } from './../../src/entity/Recruits';
import { getRepository } from 'typeorm';
import { Recruit_comments } from './../../src/entity/Recruit_comments';

const showRecruitBoard = async (req: Request, res: Response) => {
	// 팀원모집 게시글 상세내용 조회
	console.log('💜showRecruitBoard- ', req.body, req.params);
	// 저장된 게시글 정보 불러오기
	const boardId = Number(req.params.board_id);
	let boardInfo;
	try {
		boardInfo = await Recruits.findOne({
			id: boardId,
		});
	} catch (err) {
		console.log('💜showRecruitBoard- err: ', err.message);
	}

	if (boardInfo === undefined) {
		res.status(400).json({
			message: 'no data about board ' + boardId,
		});
	} else {
		// 형태 변환
		if (boardInfo.recruit_members !== '') {
			boardInfo.recruit_members = JSON.parse(boardInfo.recruit_members);
		}
		if (boardInfo.require_stack !== '') {
			boardInfo.require_stack = JSON.parse(boardInfo.require_stack);
		}
		// view 1 증가
		boardInfo.view += 1;
		try {
			boardInfo.save();
		} catch (err) {
			console.log('💜showRecruitBoard- err: ', err.message);
		}
		// 댓글 개수 세기
		let countComments = 0;
		try {
			let findComments = await getRepository(Recruit_comments).findAndCount({
				relations: ['recruits'],
			});
			countComments = Number(findComments.pop());
		} catch (err) {
			console.log('💜showRecruitBoard- err: ', err.message);
		}
		// 데이터 보내기
		res.status(200).json({
			...boardInfo,
			countComments,
		});
	}
};

export default showRecruitBoard;
