import { Request, Response } from 'express';
import { Users } from '../../src/entity/Users';
import { getRepository } from 'typeorm';

const getProfile = async (req: Request, res: Response) => {
	// 프로필 정보 조회
	console.log('🧡getProfile- ', req.body);
	const userId = req.userId;
	// 저장된 유저 정보 불러오기
	const userInfo = await Users.findOne({
		where: {
			id: userId,
		},
	});
	if (userInfo === undefined) {
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
		// 형태 변환
		console.log(userInfo, stackArray); // test
		res.status(200).json({
			...userInfo,
			career: userInfo.career !== undefined && userInfo.career !== '' ? JSON.parse(userInfo.career) : '{}',
			stacks: stackArray,
		});
	}
};

export default getProfile;
