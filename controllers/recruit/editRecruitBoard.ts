import { Request, Response } from 'express';
import { Stacks } from '../../src/entity/Stacks';
import { Recruits } from '../../src/entity/Recruits';

const editRecruitBoard = async (req: Request, res: Response) => {
	// 팀원모집 게시글 수정
	console.log('💜editRecruitBoard- ');
	console.log(req.body, req.params);
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
			recruitImage,
		} = req.body;
		const found = await Recruits.findOne({ where: { id: req.params.board_id } });
		const stackArray = [];
		for (let i = 0; i < requireStack.length; i++) {
			const foundStack = await Stacks.findOne({
				where: {
					name: requireStack[i],
				},
			});
			stackArray.push(foundStack!);
		}
		if (found) {
			found.name = name;
			found.simpleDesc = simpleDesc;
			found.recruitMembers = JSON.stringify(recruitMembers);
			found.serviceStep = serviceStep;
			found.period = period;
			found.detailTitle = detailTitle;
			found.detailDesc = detailDesc;
			found.uploadImage = req.uploadImageName ? req.uploadImageName : recruitImage;
			found.stacks = stackArray;
			found.save();
			console.log(found); // test
			res.status(200).json({
				...found,
				recruitMembers: JSON.parse(found.recruitMembers),
				requireStack: found.stacks.map(el => el.name),
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
