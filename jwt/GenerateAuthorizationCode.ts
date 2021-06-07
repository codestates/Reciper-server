const jwt = require('jsonwebtoken');
import * as dotenv from 'dotenv';

dotenv.config();

export default async function authorizationCodeGenerator() {
	let token: string | undefined;
	await jwt.sign(
		{
			iat: Math.floor(Date.now() / 1000),
			exp: Math.floor(Date.now() / 1000) + 60 * 30, // 5분? 30
		},
		process.env.AUTHORIZATION_SECRET,
		async (err: Error | null, encoded: string | undefined) => {
			if (err) {
				return new Error('Not generation AuthorizationCode');
			}
			token = encoded;
			//console.log(encoded);
		},
	);
	return token;
}
