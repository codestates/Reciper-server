import { Request, Response } from 'express';

const getProfile = async (req: Request, res: Response) => {
	// 프로필 정보 조회
	console.log('🧡getProfile- ', req.body);
};

export default getProfile;
