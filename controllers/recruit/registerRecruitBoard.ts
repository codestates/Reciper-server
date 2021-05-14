import { Request, Response } from 'express';
import { Recruits } from '../../src/entity/Recruits';
import { Stacks } from '../../src/entity/Stacks';
import { Users } from '../../src/entity/Users';

const registerRecruitBoard = async (req: Request, res: Response) => {
	// 팀원모집 게시글 등록
	console.log('💜registerRecruitBoard- ', req.body);
	try {
		const userId = req.userId;
		const { name, simpleDesc, recruitMembers, requireStack, serviceStep, period, detailTitle, detailDesc } = req.body;
		// 작성자 정보 가져오기
		const userInfo = await Users.findOne({
			id: userId,
		});
		if (userInfo) {
			const created = await Recruits.create({
				name,
				simpleDesc,
				recruitMembers: JSON.stringify(recruitMembers),
				serviceStep,
				period,
				detailTitle,
				detailDesc,
				writer: userInfo,
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
			created.stacks = stackArray;
			created.save();
			if (userInfo.recruitBoards === undefined) {
				userInfo.recruitBoards = [];
			}
			userInfo.recruitBoards.push(created);
			userInfo.save();
			console.log(created); // test
			res.status(200).json({
				...created,
				recruitMembers: JSON.parse(created.recruitMembers),
				requireStack: stackArray.map(el => el.name),
			});
		} else {
			res.status(400).json({
				message: 'user is not found',
			});
		}
	} catch (err) {
		console.log('💜registerRecruitBoard- err: ', err.message);
		res.status(400).json({
			message: err.message,
		});
	}
};

export default registerRecruitBoard;
