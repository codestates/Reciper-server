import { Request, Response } from 'express';
import { Users } from '../../src/entity/Users';
import { getRepository } from 'typeorm';

const getProfile = async (req: Request, res: Response) => {
	// 프로필 정보 조회
	console.log('🧡getProfile- ', req.body);
	const userId = 3; //req.userId;
	// 저장된 유저 정보 불러오기
	const userInfo = await Users.findOne({
		id: userId,
	});
	if (userInfo === undefined) {
		res.status(400).json({
			message: 'no data about profile',
		});
	} else {
		// stack 데이터 가져오기
		const stackArray: any = [];
		const stackData = await getRepository(Users).find({
			relations: ['join'],
			where: {
				id: userInfo.id,
			},
		});
		console.log(stackData); // test
		stackData.map(el => {
			el.join.map(e => {
				stackArray.push(e.name);
			});
		});
		// 형태 변환
		if (userInfo.career !== '') {
			userInfo.career = JSON.parse(userInfo.career);
		}
		console.log(userInfo, stackArray); // test
		res.status(200).json({
			...userInfo,
			stacks: stackArray,
		});
	}
};

export default getProfile;
