import { Request, Response } from 'express';
import { Stacks } from '../../src/entity/Stacks';
import { Recruits } from '../../src/entity/Recruits';

const editRecruitBoard = async (req: Request, res: Response) => {
	// 팀원모집 게시글 수정
	console.log('💜editRecruitBoard- ', req.body, req.params);
	// req.body = {
	// 	name:"같이해요 레시퍼 ",
	// 	simple_desc:"팀원 구합니다 백엔드 3분",
	// 	recruit_members: "{포지션:백엔드,경력:3년,인원:3,모집기한:7일}", //대략 이렇다는것
	// 	require_stack:['node.js','express.js','aws'],
	// 	service_step:"모집중?",
	// 	period:"6개월",
	// 	detail_title:"",
	// 	detail_desc:"",
	// }
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
			// created.remove();
			found.save();
			console.log(found);
			res.status(200).json({
				...found,
			});
		} else {
			res.status(400).json({ message: 'not found board' });
		}
	} catch (err) {
		console.log('💜editRecruitBoard- err: ', err.message);
		res.status(400).json({
			message: err.message,
		});
	}
};

export default editRecruitBoard;
