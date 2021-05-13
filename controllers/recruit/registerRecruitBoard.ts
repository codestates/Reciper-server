import { Request, Response } from 'express';
import { Recruits } from '../../src/entity/Recruits';
import { Stacks } from '../../src/entity/Stacks';

const registerRecruitBoard = async (req: Request, res: Response) => {
	// 팀원모집 게시글 등록
	console.log('💜registerRecruitBoard- ', req.body);
	try {
		const { name, simple_desc, recruit_members, require_stack, service_step, period, detail_title, detail_desc } =
			req.body;
		const created = await Recruits.create({
			name,
			simple_desc,
			recruit_members: JSON.stringify(recruit_members),
			service_step,
			period,
			detail_title,
			detail_desc,
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
		console.log(created); // test
		console.log(created);
		res.status(200).json({
			...created,
			recruit_members: JSON.parse(created.recruit_members),
			require_stack: JSON.parse(created.require_stack),
		});
	} catch (err) {
		console.log('💜registerRecruitBoard- err: ', err.message);
		res.status(400).json({
			message: err.message,
		});
	}
};

export default registerRecruitBoard;
