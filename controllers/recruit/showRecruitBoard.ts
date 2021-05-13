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
		console.log(boardInfo);
	} catch (err) {
		console.log('💜showRecruitBoard- err: ', err.message);
	}

	if (boardInfo === undefined) {
		res.status(400).json({
			message: 'no data about board ' + boardId,
		});
	} else {
		// 형태 변환
		// if (boardInfo.recruit_members !== '') {
		// 	boardInfo.recruit_members = JSON.parse(boardInfo.recruit_members);
		// }
		// stack 데이터 가져오기
		const stackArray: any = [];
		const stackData = await getRepository(Recruits).find({
			relations: ['join'],
			where: {
				id: boardInfo.id,
			},
		});
		stackData.map(el => {
			el.join.map(e => {
				stackArray.push(e.name);
			});
		});
		boardInfo.require_stack = JSON.stringify(stackArray);
		// view 1 증가
		boardInfo.view += 1;
		try {
			boardInfo.save();
		} catch (err) {
			console.log('💜showRecruitBoard- err: ', err.message);
		}
		// 댓글 개수 세기 + 댓글 전체 데이터 가져오기
		let commentsCount = 0;
		let commentsList: any[] = [];
		try {
			let findComments = await getRepository(Recruit_comments).findAndCount({
				relations: ['recruits'],
				where: {
					recruits: {
						id: boardId,
					},
				},
			});
			findComments.forEach(el => {
				if (typeof el === 'number') {
					commentsCount = Number(el);
				} else {
					commentsList.push(el);
				}
			});
		} catch (err) {
			console.log('💜showRecruitBoard- err: ', err.message);
		}
		// 데이터 보내기
		console.log(boardInfo, commentsCount, [...commentsList[0]]); // test
		res.status(200).json({
			...boardInfo,
			recruit_members: JSON.parse(boardInfo.recruit_members),
			require_stack: stackArray,
			commentsCount,
			commentsList: [...commentsList[0]],
		});
	}
};

export default showRecruitBoard;
