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
			where: {
				id: userId,
			},
		});
		const projectList = await getRepository(Projects).find({
			where: {
				members: {
					id: userId,
				},
			},
			order: {
				createdAt: 'DESC', // 순서 고민해보기
			},
		});
		console.log(userInfo, projectList); //test
		res.status(200).json({
			...userInfo,
			projectList,
		});
	} catch (err) {
		console.log('💛showProjectList- err: ', err.message);
		res.status(400).json({
			message: err.message,
		});
	}
};

export default showProjectList;
