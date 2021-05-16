import { Request, Response } from 'express';
import { Stacks } from '../../src/entity/Stacks';
import { Recruits } from '../../src/entity/Recruits';
import { getRepository } from 'typeorm';

const editRecruitBoard = async (req: Request, res: Response) => {
	// 팀원모집 게시글 수정
	console.log('💜editRecruitBoard- ');
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
			foundBoard.uploadImage = req.uploadImageName ? req.uploadImageName : uploadImage;
			foundBoard.stacks = stackArray;
			foundBoard.save();
			console.log(foundBoard); // test
			res.status(200).json({
				...foundBoard,
				recruitMembers: JSON.parse(foundBoard.recruitMembers),
				requireStack: stackArray.map(el => el.name),
			});
		} else {
			res.status(400).json({
				message: 'not found board',
			});
		}
	} catch (err) {
		console.log('💜editRecruitBoard- err: ', err.message);
		res.status(400).json({
			message: err.message,
		});
	}
};

export default editRecruitBoard;
