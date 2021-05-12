import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import axios from 'axios';
import { Users } from '../src/entity/Users';
import * as dotenv from 'dotenv';
dotenv.config();

interface Itoken {
	userId: number;
	email: string;
	iat: number;
	exp: number;
}

export const authChecker = async (req: Request, res: Response, next: NextFunction) => {
	console.log('🔒authChecker 실행합니다 - headers:\n', req.headers, '\n-------------\n');
	if (req.headers.authorization) {
		const accessToken = req.headers.authorization.split('Bearer ')[1];
		const LoginType = req.headers.logintype;
		if (LoginType === 'email') {
			// 로그인 방식 - email
			try {
				const decoded = (await jwt.verify(accessToken, process.env.ACCESS_SECRET as string)) as Itoken;
				console.log(decoded);

				if (typeof decoded !== 'string') {
					req.userEmail = decoded.email;
					req.userId = decoded.userId;
				}
			} catch (err) {
				console.log('🔒error:email - ', err.message);
				res.status(400).json({ message: err.message });
				return;
			}
		} else if (LoginType === 'google') {
			// 로그인 방식 - google
			// access token으로 유저 정보 가져오기
			const googleInfoURL = 'https://www.googleapis.com/oauth2/v3/userinfo';
			const resInfo = await axios
				.get(googleInfoURL, {
					headers: {
						authorization: `Bearer ${accessToken}`,
					},
				})
				.then(result => result.data.email)
				.catch(err => {
					// 에러 발생 -> 인증 불가 -> 다시 로그인해야함
					console.log('🔒error:google - ', err.message);
					res.status(400).json({ message: err.message });
				});
			const userInfo = await Users.findOne({
				where: {
					email: resInfo,
				},
			});
			if (userInfo) {
				req.userEmail = resInfo;
				req.userId = userInfo.id;
			} else {
				// 유저 정보를 찾을 수 없음 -> 인증 불가 -> 다시 로그인해야함
				res.status(400).json({ message: 'err exist' });
			}
		} else if (LoginType === 'github') {
			// 로그인 방식 - github
			// refresh token이 없음, 로그아웃 하기 전까지 access token 계속 사용 가능
			// req.newAccessToken = accessToken;
			// access token으로 유저 정보 가져오기
			const githubInfoURL = 'https://api.github.com/user';
			const resInfo = await axios
				.get(githubInfoURL, {
					headers: {
						authorization: `Bearer ${accessToken}`,
					},
				})
				.then(result => result.data.login)
				.catch(err => {
					// 에러 발생 -> 인증 불가 -> 다시 로그인해야함
					console.log('🔒error:github - ', err.message);
					res.redirect(`${process.env.CLIENT_URL}/login`);

					return;
				});
			const email = `${resInfo}@github.com`;
			const userInfo = await Users.findOne({
				where: {
					email,
				},
			});
			if (userInfo) {
				req.userEmail = email;
				req.userId = userInfo.id;
			} else {
				// 유저 정보를 찾을 수 없음 -> 인증 불가 -> 다시 로그인해야함
				res.status(400).json({ message: 'err exist' });
			}
		}
		// access token을 확인한 결과를 토대로 결정
		console.log('🔒authChecker result - ', LoginType, req.userId, req.userEmail, '\n');
		if (req.userId !== undefined && req.userEmail !== undefined) {
			// 실제 요청으로 넘어감
			console.log('🔒go next function!!\n\n');
			next();
		} else {
			// 에러 발생 -> 로그인 페이지로 돌아감
			res.status(400).json({ message: 'err exist' });
		}
	} else {
		// access token이 없을 때 -> 로그인 페이지로 돌아감
		res.status(400).json({ message: 'err exist' });
	}
};
