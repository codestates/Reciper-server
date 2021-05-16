import { Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
import { accessTokenGenerator } from '../../jwt/GenerateAccessToken';
import { refreshTokenGenerator } from '../../jwt/GenerateRefreshToken';
import { Users } from '../../src/entity/Users';
import randomColorGenerator from '../login/randomColorGenerator';
dotenv.config();

const loginEmail = {
	authorizationCode: async (req: Request, res: Response) => {
		console.log('💙login: email- ', req.body);
		const authorizationCode: string = req.body.authorizationCode as string;
		const email: string = req.body.email as string;
		let accessToken: string;
		let refreshToken: string;
		// authorization code를 이용해 access token을 발급
		try {
			const verified = jwt.verify(authorizationCode, process.env.AUTHORIZATION_SECRET as string);
			const user = await Users.findOne({
				where: {
					email,
				},
			});
			if (!user) {
				//not found userData
				const newUser = await Users.create({
					email,
					name: email.split('@')[0],
					profileColor: randomColorGenerator(),
				});
				const saved = await newUser.save();
				accessToken = await accessTokenGenerator(saved.id, email);
				refreshToken = await refreshTokenGenerator(saved.id, email);
			} else {
				accessToken = await accessTokenGenerator(user.id, email);
				refreshToken = await refreshTokenGenerator(user.id, email);
			}
			console.log('💙email: at - ', accessToken, '\n💙email: rt - ', refreshToken);
			res.cookie('refreshToken', refreshToken, {
				maxAge: 1000 * 60 * 60 * 24 * 7,
				httpOnly: true,
				// secure: true,
				// sameSite: 'none',
			});
			res.json({
				accessToken,
				loginType: 'email',
				email,
			});
		} catch (err) {
			console.log('💙email: ', err.message);
			res.status(400).json({
				message: err.message,
			});
		}
	},
};

export default loginEmail;
