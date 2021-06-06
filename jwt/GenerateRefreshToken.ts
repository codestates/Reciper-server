const jwt = require('jsonwebtoken');
import * as dotenv from 'dotenv';

dotenv.config();

export async function refreshTokenGenerator(id: number, email: string): Promise<string> {
	let token: string = jwt.sign(
		{
			userId: id,
			email: email,
			iat: Math.floor(Date.now() / 1000),
			exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7, // 일주일
		},
		process.env.REFRESH_SECRET,
	);
	//console.log('urt', token);
	return token;
}
