const jwt = require('jsonwebtoken');
import * as dotenv from 'dotenv';

dotenv.config();

export async function accessTokenGenerator(id: number, email: string): Promise<string> {
	let token: string = jwt.sign(
		{
			userId: id,
			email: email,
			iat: Math.floor(Date.now() / 1000),
			exp: Math.floor(Date.now() / 1000) + 60 * 60 * 2, // 2시간
			// exp: Math.floor(Date.now() / 1000) + 60 * 5, // 5분 테스트용
		},
		process.env.ACCESS_SECRET,
	);
	//console.log('uat', token);
	return token;
}
