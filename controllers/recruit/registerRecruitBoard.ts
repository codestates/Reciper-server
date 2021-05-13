import { Request, Response } from 'express';
import { Recruits } from '../../src/entity/Recruits';
import { Stacks } from '../../src/entity/Stacks';

const registerRecruitBoard = async (req: Request, res: Response) => {
	// 팀원모집 게시글 등록
	console.log('💜registerRecruitBoard- ', req.body);
	// req.body = {
	// 	name:"같이해요 레시퍼 ",
	// 	simple_desc:"팀원 구합니다 백엔드 3분",
	// 	recruit_members: "{포지션:백엔드,경력:3년,인원:3,모집기한:7일}", //대략 이렇다는것
	// 	stacks:['node.js','express.js','aws'],
	// 	service_step:"모집중?",
	// 	period:"6개월",
	// 	detail_title:"",
	// 	detail_desc:"",
	// }
	try {
		const { name, simple_desc, recruit_members, stacks, service_step, period, detail_title, detail_desc } = req.body;
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
		for (let i = 0; i < stacks.length; i++) {
			const foundStack = await Stacks.findOne({ where: { name: stacks[i] } });
			stackArray.push(foundStack!);
		}

		created.join = stackArray;
		created.remove();
		created.save();
		res.status(200).json({ data: created });
	} catch (err) {
		res.status(400).json({ message: err.message });
	}
};

export default registerRecruitBoard;
