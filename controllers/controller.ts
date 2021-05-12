// 1. login(로그인)
import sendEmail from './login/sendEmail';
import loginEmail from './login/loginEmail';
import loginGoogle from './login/loginGoogle';
import loginGithub from './login/loginGithub';
// 2, profile(프로필)
import getProfile from './profile/getProfile';
import postProfile from './profile/postProfile';

export {
	// login
	sendEmail,
	loginEmail,
	loginGoogle,
	loginGithub,
	// profile
	getProfile,
	postProfile,
};
