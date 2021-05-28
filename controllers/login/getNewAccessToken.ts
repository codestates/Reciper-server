import { Request, Response } from 'express';

const getNewAccessToken = async (req: Request, res: Response) => {
	// 새로운 access token 발급하기
	console.log('💙getNewAccessToken-\n', {
		accessToken: req.headers.authorization,
		cloginType: req.headers.logintype,
		cookies: req.cookies,
	});
};

export default getNewAccessToken;
