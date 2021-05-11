import { Request, Response } from 'express';
import axios from 'axios';
import * as dotenv from 'dotenv';
dotenv.config();
import { Users } from '../../src/entity/Users';

const githubLoginURL = 'https://github.com/login/oauth/access_token';
const githubInfoURL = 'https://api.github.com/user';

const loginGithub = async (req: Request, res: Response) => {
	// 로그인 - OAuth 방식: github
	console.log('💙login: github- ', req.body);

	// authorization code를 이용해 access token을 발급받음
	await axios
		.post(
			githubLoginURL,
			{
				client_id: process.env.GITHUB_CLIENT_ID,
				client_secret: process.env.GITHUB_CLIENT_SECRET,
				code: req.body.authorizationCode,
			},
			{
				headers: {
					accept: 'application/json',
				},
			},
		)
		.then(async result => {
			console.log(result.data);
			let accessToken = result.data.access_token;
			// accessToken을 통해 로그인한 유저 정보 가져오기
			const resInfo = await axios
				.get(githubInfoURL, {
					headers: {
						authorization: `Bearer ${accessToken}`,
					},
				})
				.then(result => result.data.login)
				.catch(err => {
					console.log('💙github: ', err.message);
				});
			// 유저정보 확인하여 새로운 유저면 데이터베이스에 저장
			const userInfo = await Users.findOne({
				email: `${resInfo}@github.com`,
			});
			if (userInfo == null && resInfo !== undefined) {
				let newUser: Users = new Users();
				newUser.email = `${resInfo}@github.com`;
				newUser.name = resInfo;
				try {
					newUser.save();
				} catch (err) {
					console.log('💙github: ', err.message);
				}
			}
			// cookie에 refresh token 저장
			res.cookie('refreshToken', accessToken, {
				maxAge: 1000 * 60 * 60 * 24 * 7,
				httpOnly: true,
			});
			// access token과 loginType을 응답으로 보내줌
			console.log('💙github: at - ', accessToken);
			res.status(200).json({
				accessToken,
				loginType: 'github',
				email: `${resInfo}@github.com`,
			});
		})
		.catch(err => {
			console.log('💙github: ', err.message);
			res.status(401).json({
				message: 'authorizationCode Error!' + err.message,
			});
		});
};

export default loginGithub;
