import { Request, Response, NextFunction } from 'express';
import getUserInfo from './getUserInfo';

interface Itoken {
	userId: number;
	email: string;
	iat: number;
	exp: number;
}

const authChecker = async (req: Request, res: Response, next: NextFunction) => {
	console.log('🔒authChecker-\n', {
		authorization: req.headers.authorization,
		logintype: req.headers.logintype,
	});
	if (req.headers.authorization) {
		const accessToken = req.headers.authorization.split('Bearer ')[1];
		const loginType = req.headers.logintype as string;
		getUserInfo(accessToken, loginType)
			.then(result => {
				const { userEmail, userId } = result;
				// access token을 확인한 결과를 토대로 결정
				console.log('🔒authChecker-result:', loginType, userEmail, userId);
				req.userId = userId;
				req.userEmail = userEmail;
				if (req.userId !== -1 && req.userEmail !== '') {
					// 실제 요청으로 넘어감
					console.log('🔒authChecker-go next function!!\n');
					next();
				} else {
					// 에러 발생
					console.log('🔒authChecker-err: access token error');
					res.status(400).json({
						message: 'access token error',
					});
				}
			})
			.catch(err => {
				console.log('🔒authChecker-err:', err.message);
				next(new Error());
			});
	} else {
		// access token이 없을 때
		console.log('🔒authChecker-err: no access token');
		res.status(400).json({
			message: 'no access token',
		});
	}
};

export default authChecker;
