import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { Users } from '../../src/entity/Users';
import { Projects } from '../../src/entity/Projects';

const showProjectList = async (req: Request, res: Response) => {
	// 프로젝트 리스트 조회
	console.log('💛showProjectList- ');
	console.log(req.body, req.params);
	const userId = req.userId;
	// 유저 정보로 프로젝트 리스트 찾기
	try {
		const userInfo = await Users.findOne({
			select: ['id', 'name', 'email', 'uploadImage', 'profileColor'],
			where: {
				id: userId,
			},
		});
		if (userInfo) {
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
			console.log('💛showProjectList- result: ');
			console.log(userInfo, projectList); //test
			res.status(200).json({
				...userInfo,
				projectList,
			});
		} else {
			console.log('💛showProjectList- err: user is not found');
			res.status(400).json({
				message: 'user is not found',
			});
		}
	} catch (err) {
		console.log('💛showProjectList- err: ', err.message);
		res.status(400).json({
			message: err.message,
		});
	}
};

export default showProjectList;
