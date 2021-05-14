import { Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
import { accessTokenGenerator } from '../../jwt/GenerateAccessToken';
import { refreshTokenGenerator } from '../../jwt/GenerateRefreshToken';
import { Users } from '../../src/entity/Users';
dotenv.config();

const loginEmail = {
	authorizationCode: async (req: Request, res: Response) => {
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
				});
				const saved = await newUser.save();
				accessToken = await accessTokenGenerator(saved.id, email);
				refreshToken = await refreshTokenGenerator(saved.id, email);
			} else {
				accessToken = await accessTokenGenerator(user.id, email);
				refreshToken = await refreshTokenGenerator(user.id, email);
			}
			res.cookie('refreshToken', refreshToken, {
				maxAge: 1000 * 60 * 60 * 24 * 7,
				httpOnly: true,
				// secure: true,
				// sameSite: 'none',
			});
			res.json({
				accessToken,
				email,
				loginType: 'email',
			});
		} catch (err) {
			res.status(400).json({
				message: err.message,
			});
		}
	},
};

export default loginEmail;
