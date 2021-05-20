import { Request, Response } from 'express';
import { Recruits } from './../../src/entity/Recruits';
import { Users } from '../../src/entity/Users';
import { getRepository } from 'typeorm';
import { Recruit_comments } from './../../src/entity/Recruit_comments';
import * as fs from 'fs';

const deleteRecruitBoard = async (req: Request, res: Response) => {
	// 팀원모집 게시글 삭제
	console.log('💜deleteRecruitBoard- ');
	console.log(req.body, req.params);
	const boardId = Number(req.params.board_id);
	// users 테이블에서 해당 게시글 데이터 지우기
	const userId = req.userId;
	const userInfo = await Users.findOne({
		where: {
			id: userId,
		},
	});
	if (userInfo) {
		const boardData = userInfo.recruitBoards;
		if (boardData !== undefined) {
			for (let idx = 0; idx < boardData.length; idx++) {
				if (boardData[idx].id === boardId) {
					boardData.splice(idx, 1);
					break;
				}
			}
			try {
				userInfo.save();
			} catch (err) {
				console.log('💜deleteRecruitBoard- err: ', err.message);
			}
		}
	} else {
		res.status(400).json({
			message: 'user is not found',
		});
	}
	// 해당 게시글과 관련된 댓글 삭제하기
	try {
		const deleteComments = await getRepository(Recruit_comments).find({
			relations: ['recruitBoard'],
			where: {
				recruitBoard: {
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
		const found = await Recruits.findOne({
			id: boardId,
		});
		// 이미지 파일 삭제하기
		const imageRoute = found!.uploadImage;
		const chkBasicNum = [];
		for (let idx = 1; idx <= 13; idx++) {
			chkBasicNum.push(String(idx) + '.png');
		}
		if (!chkBasicNum.includes(imageRoute.split('_')[2])) {
			fs.access(`${__dirname}/../../uploads/${imageRoute}`, fs.constants.F_OK, err => {
				if (err) {
					return console.log('삭제할 수 없는 파일입니다', err.message);
				}
				fs.unlink(`${__dirname}/../../uploads/${imageRoute}`, err =>
					err
						? console.log(err.message)
						: console.log(`${__dirname}/../../uploads/${imageRoute} 를 정상적으로 삭제했습니다`),
				);
			});
		}
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
