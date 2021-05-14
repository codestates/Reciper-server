import { Request, Response } from 'express';
import { Recruits } from '../../src/entity/Recruits';
import { Stacks } from '../../src/entity/Stacks';
import { Users } from '../../src/entity/Users';

const registerRecruitBoard = async (req: Request, res: Response) => {
	// 팀원모집 게시글 등록
	console.log('💜registerRecruitBoard- ', req.body);
	try {
		const userId = req.userId;
		const { name, simple_desc, recruit_members, require_stack, service_step, period, detail_title, detail_desc } =
			req.body;
		// 작성자 정보 가져오기
		const userInfo = await Users.findOne({
			id: userId,
		});
		if (userInfo) {
			const created = await Recruits.create({
				name,
				simple_desc,
				recruit_members: JSON.stringify(recruit_members),
				service_step,
				period,
				detail_title,
				detail_desc,
				writer: userInfo,
			});
			const stackArray = [];
			for (let i = 0; i < require_stack.length; i++) {
				const foundStack = await Stacks.findOne({
					where: {
						name: require_stack[i],
					},
				});
				stackArray.push(foundStack!);
			}
			created.join = stackArray;
			created.require_stack = JSON.stringify(
				stackArray.map(el => {
					return el.name;
				}),
			);
			created.save();
			if (userInfo.recruitBoards === undefined) {
				userInfo.recruitBoards = [];
			}
			userInfo.recruitBoards.push(created);
			userInfo.save();
			console.log(created); // test
			res.status(200).json({
				...created,
				recruit_members: JSON.parse(created.recruit_members),
				require_stack: JSON.parse(created.require_stack),
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
