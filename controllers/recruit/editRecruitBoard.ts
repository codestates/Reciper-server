import { Request, Response } from 'express';
import { Stacks } from '../../src/entity/Stacks';
import { Recruits } from '../../src/entity/Recruits';
import { getRepository } from 'typeorm';
import { Recruit_comments } from '../../src/entity/Recruit_comments';
import * as fs from 'fs';

const editRecruitBoard = async (req: Request, res: Response) => {
	// 팀원모집 게시글 수정
	console.log('💜editRecruitBoard-');
	console.log(req.body, req.params);
	const boardId = Number(req.params.board_id);
	try {
		const {
			name,
			simpleDesc,
			recruitMembers,
			requireStack,
			serviceStep,
			period,
			detailTitle,
			detailDesc,
			uploadImage,
		} = req.body;
		const foundBoard = await getRepository(Recruits).findOne({
			relations: ['writer'],
			where: {
				id: boardId,
			},
		});
		const stackArray = [];
		for (let i = 0; i < requireStack.length; i++) {
			const foundStack = await Stacks.findOne({
				where: {
					name: requireStack[i],
				},
			});
			stackArray.push(foundStack!);
		}
		if (foundBoard) {
			foundBoard.name = name;
			foundBoard.simpleDesc = simpleDesc;
			foundBoard.recruitMembers = JSON.stringify(recruitMembers);
			foundBoard.serviceStep = serviceStep;
			foundBoard.period = period;
			foundBoard.detailTitle = detailTitle;
			foundBoard.detailDesc = detailDesc;
			if (uploadImage) {
				const imageRoute = foundBoard.uploadImage;
				fs.access(`${__dirname}/../../uploads/${imageRoute}`, fs.constants.F_OK, err => {
					if (err) {
						return console.log('💜editRecruitBoard-err: 삭제할 수 없는 파일입니다', err.message);
					}
					fs.unlink(`${__dirname}/../../uploads/${imageRoute}`, err =>
						err
							? console.log('💜editRecruitBoard-err:', err.message)
							: console.log(`💜editRecruitBoard-${__dirname}/../../uploads/${imageRoute}를 정상적으로 삭제했습니다`),
					);
				});
			}
			foundBoard.uploadImage = uploadImage;
			foundBoard.stacks = stackArray;
			await foundBoard.save();
			//  해당 게시글의 댓글 데이터
			const commentsList = await getRepository(Recruit_comments).find({
				relations: ['writer'],
				where: {
					recruitBoard: foundBoard,
				},
			});
			console.log('💜editRecruitBoard-result:', foundBoard); // test
			res.status(200).json({
				...foundBoard,
				recruitMembers: JSON.parse(foundBoard.recruitMembers),
				requireStack: stackArray.map(el => el.name),
				commentsList,
			});
		} else {
			res.status(400).json({
				message: 'not found board',
			});
		}
	} catch (err) {
		console.log('💜editRecruitBoard-err:', err.message);
		res.status(400).json({
			message: err.message,
		});
	}
};

export default editRecruitBoard;
