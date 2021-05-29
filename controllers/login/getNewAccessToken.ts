import { Request, Response } from 'express';
import jwt, { VerifyErrors } from 'jsonwebtoken';
import { accessTokenGenerator } from '../../jwt/GenerateAccessToken';
import axios from 'axios';
import * as dotenv from 'dotenv';
dotenv.config();

const getNewAccessToken = async (req: Request, res: Response) => {
	// 새로운 access token 발급하기
	console.log('💙getNewAccessToken-\n', {
		accessToken: req.headers.authorization,
		loginType: req.headers.logintype,
		cookies: req.cookies,
	});
	if (req.cookies.refreshToken && req.headers.authorization) {
		const { refreshToken } = req.cookies;
		const accessToken = req.headers.authorization.split('Bearer ')[1];
		const loginType = req.headers.logintype as string;
		let newAccessToken = '';
		if (loginType === 'email') {
			await jwt.verify(
				refreshToken,
				process.env.REFRESH_SECRET as string,
				async (err: VerifyErrors | null, decoded: any | null) => {
					if (err) {
						// 잘못된 토큰이거나, 만기된 토큰일경우 에러 발생
						console.log('💙getNewAccessToken:err-[email] invalid refreshToken', err.message);
						res.status(400).json({
							message: 'invalid refreshToken ' + err.message,
						});
					} else {
						// 새로운 access token을 발급받음
						newAccessToken = await accessTokenGenerator(decoded.userId, decoded.email);
					}
				},
			);
		} else if (loginType === 'google') {
			// 로그인 방식 - google
			// refresh token을 이용하여 새로운 access token을 발급받음
			const googleLoginURL = 'https://accounts.google.com/o/oauth2/token';
			newAccessToken = await axios
				.post(googleLoginURL, {
					client_id: process.env.GOOGLE_CLIENT_ID,
					client_secret: process.env.GOOGLE_CLIENT_SECRET,
					grant_type: 'refresh_token',
					refresh_token: req.cookies.refreshToken,
				})
				.then(async result => result.data.access_token)
				.catch(err => {
					// 에러 발생 -> 인증 불가 -> 다시 로그인해야함
					console.log('💙getNewAccessToken:err-[google] invalid refreshToken', err.message);
					res.status(400).json({
						message: 'invalid refreshToken ' + err.message,
					});
				});
		} else if (loginType === 'github') {
			// 로그인 방식 - github
			newAccessToken = refreshToken;
		}
		console.log('💙getNewAccessToken-result:', loginType, newAccessToken);
		if (newAccessToken !== '') {
			res.status(200).json({
				newAccessToken,
				loginType,
			});
		} else {
			console.log('💙getNewAccessToken-err: new access token error');
			res.status(400).json({
				message: 'new access token error',
			});
		}
	} else {
		console.log('💙getNewAccessToken-err: invalid token error');
		res.status(400).json({
			message: 'invalid token error',
		});
	}
};

export default getNewAccessToken;
