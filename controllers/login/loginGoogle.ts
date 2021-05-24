import { Request, Response } from 'express';
import axios from 'axios';
import * as dotenv from 'dotenv';
import { Users } from '../../src/entity/Users';
import randomColorGenerator from '../login/randomColorGenerator';
dotenv.config();

const googleLoginURL = 'https://accounts.google.com/o/oauth2/token';
const googleInfoURL = 'https://www.googleapis.com/oauth2/v3/userinfo';

const loginGoogle = async (req: Request, res: Response) => {
	// 로그인 - OAuth 방식: google
	console.log('💙login: google- ', req.body);
	// authorization code를 이용해 access token을 발급받음
	await axios
		.post(googleLoginURL, {
			client_id: process.env.GOOGLE_CLIENT_ID,
			client_secret: process.env.GOOGLE_CLIENT_SECRET,
			code: req.body.authorizationCode,
			redirect_uri: `${process.env.CLIENT_URL}/loginloading`,
			grant_type: 'authorization_code',
		})
		.then(async result => {
			let accessToken = result.data.access_token;
			let refreshToken = result.data.refresh_token;
			// accessToken을 통해 로그인한 유저 정보 가져오기
			const resInfo = await axios
				.get(googleInfoURL, {
					headers: {
						authorization: `Bearer ${accessToken}`,
					},
				})
				.then(result => result.data.email)
				.catch(err => {
					console.log('💙google: ', err.message);
				});
			// 유저정보 확인하여 새로운 유저면 데이터베이스에 저장
			const userInfo = await Users.findOne({
				email: resInfo,
			});
			if (userInfo == null && resInfo !== undefined) {
				let newUser: Users = new Users();
				newUser.email = resInfo;
				newUser.name = resInfo.split('@')[0];
				newUser.profileColor = randomColorGenerator();
				try {
					newUser.save();
				} catch (err) {
					console.log('💙google: ', err.message);
				}
			}
			// cookie에 refresh token 저장
			res.cookie('refreshToken', refreshToken, {
				maxAge: 1000 * 60 * 60 * 24 * 7,
				httpOnly: true,
			});
			// access token과 loginType, email을 응답으로 보내줌
			console.log('💙google: at - ', accessToken, '\n💙google: rt - ', refreshToken);
			res.status(200).json({
				accessToken,
				loginType: 'google',
				email: resInfo,
			});
		})
		.catch(err => {
			console.log('💙google: ', err.message);
			res.status(401).json({
				message: 'authorizationCode Error!' + err.message,
			});
		});
};

export default loginGoogle;
