import { Request, Response } from 'express';

const postProfile = async (req: Request, res: Response) => {
	// 프로필 정보 저장/수정
	console.log('🧡postProfile- ', req.body);
};

export default postProfile;
