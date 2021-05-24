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

const getUserInfo = async (accessToken: string, loginType: string) => {
	console.log('🔎getUserInfo 실행합니다-\n', { accessToken, loginType });
	const result = {
		userEmail: '',
		userId: -1,
	};

	if (loginType === 'email') {
		// 로그인 방식 - email
		try {
			const decoded = (await jwt.verify(accessToken, process.env.ACCESS_SECRET as string)) as Itoken;
			if (typeof decoded !== 'string') {
				result.userEmail = decoded.email;
				result.userId = decoded.userId;
			}
		} catch (err) {
			console.log('🔎getUserInfo: err-[email]', err.message);
			throw new Error(err);
		}
	} else if (loginType === 'google') {
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
				console.log('🔎getUserInfo: err-[google]', err.message);
				throw new Error(err);
			});
		const userInfo = await Users.findOne({
			email: resInfo,
		});
		if (userInfo) {
			result.userEmail = resInfo;
			result.userId = userInfo.id;
		} else {
			// 유저 정보를 찾을 수 없음 -> 인증 불가 -> 다시 로그인해야함
			throw new Error('no user data');
		}
	} else if (loginType === 'github') {
		// 로그인 방식 - github
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
				console.log('🔎getUserInfo: err-[github]', err.message);
				throw new Error(err);
			});
		const email = `${resInfo}@github.com`;
		const userInfo = await Users.findOne({
			email,
		});
		if (userInfo) {
			result.userEmail = email;
			result.userId = userInfo.id;
		} else {
			// 유저 정보를 찾을 수 없음 -> 인증 불가 -> 다시 로그인해야함
			throw new Error('no user data');
		}
	}
	console.log('🔎getUserInfo 결과-', loginType, result.userId, result.userEmail);
	return result;
};

export default getUserInfo;
