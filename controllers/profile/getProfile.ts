import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { Users } from '../../src/entity/Users';
import { Projects } from '../../src/entity/Projects';

const getProfile = async (req: Request, res: Response) => {
	// 프로필 정보 조회
	console.log('🧡getProfile-');
	const userId = req.userId;
	// 저장된 유저 정보 불러오기
	const userInfo = await Users.findOne({
		where: {
			id: userId,
		},
	});
	if (userInfo === undefined) {
		console.log('🧡getProfile-err: no data about profile');
		res.status(400).json({
			message: 'no data about profile',
		});
	} else {
		// stack 데이터 가져오기
		const stackArray: any = [];
		const stackData = await getRepository(Users).find({
			relations: ['stacks'],
			where: {
				id: userInfo.id,
			},
		});
		stackData.map(stack => {
			stack.stacks.map(stack => {
				stackArray.push(stack.name);
			});
		});
		// project 데이터 가져오기
		const allProjects = await getRepository(Projects).find({
			relations: ['members'],
			order: {
				createdAt: 'DESC', // 순서: 최신순
			},
		});
		let projectList = [];
		for (let idx = 0; idx < allProjects.length; idx++) {
			let members: number[] = allProjects[idx].members.map(el => el.id);
			if (members.includes(userInfo.id)) {
				let obj = { ...allProjects[idx], members };
				projectList.push(obj);
			}
		}
		res.status(200).json({
			...userInfo,
			career: userInfo.career !== undefined && userInfo.career !== '' ? JSON.parse(userInfo.career) : '{}',
			stacks: stackArray,
			projectList,
		});
	}
};

export default getProfile;
