import { Request, Response } from 'express';
import { Stacks } from '../../src/entity/Stacks';
import { Recruits } from '../../src/entity/Recruits';

const editRecruitBoard = async (req: Request, res: Response) => {
	// 팀원모집 게시글 수정
	console.log('💜editRecruitBoard- ', req.body, req.params);
	try {
		const { name, simple_desc, recruit_members, require_stack, service_step, period, detail_title, detail_desc } =
			req.body;
		const found = await Recruits.findOne({ where: { id: req.params.board_id } });
		const stackArray = [];
		for (let i = 0; i < require_stack.length; i++) {
			const foundStack = await Stacks.findOne({
				where: {
					name: require_stack[i],
				},
			});
			stackArray.push(foundStack!);
		}
		if (found) {
			found.name = name;
			found.simple_desc = simple_desc;
			found.recruit_members = JSON.stringify(recruit_members);
			found.service_step = service_step;
			found.require_stack = JSON.stringify(
				stackArray.map(el => {
					return el.name;
				}),
			);
			found.period = period;
			found.detail_title = detail_title;
			found.detail_desc = detail_desc;
			found.join = stackArray;
			found.save();
			console.log(found); // test
			res.status(200).json({
				...found,
				recruit_members: JSON.parse(found.recruit_members),
				require_stack: JSON.parse(found.require_stack),
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
