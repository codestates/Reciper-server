import { Request, Response } from 'express';
import { Users } from '../../src/entity/Users';

const getProfile = async (req: Request, res: Response) => {
	// 프로필 정보 조회
	console.log('🧡getProfile- ', req.body);
	const userId = req.userId;
	// 저장된 유저 정보 불러오기
	const userInfo = await Users.findOne({
		id: userId,
	});
	if (userInfo === undefined) {
		res.status(400).json({
			message: 'no data about profile',
		});
	} else {
		if (userInfo.career !== '') {
			userInfo.career = JSON.parse(userInfo.career);
		}
		res.status(200).json({
			...userInfo,
		});
	}
};

export default getProfile;
