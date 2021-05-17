// 1. login(로그인)
import sendEmail from './login/sendEmail';
import loginEmail from './login/loginEmail';
import loginGoogle from './login/loginGoogle';
import loginGithub from './login/loginGithub';
// 2, profile(프로필)
import getProfile from './profile/getProfile';
import postProfile from './profile/postProfile';
// 3. recruit(팀원모집)
import recruitList from './recruit/recruitList';
import showRecruitBoard from './recruit/showRecruitBoard';
import registerRecruitBoard from './recruit/registerRecruitBoard';
import editRecruitBoard from './recruit/editRecruitBoard';
import deleteRecruitBoard from './recruit/deleteRecruitBoard';
import registerComment from './recruit/registerComment';
import deleteComment from './recruit/deleteComment';
// 4. Stacks
import getStacks from './stacks/getStacks';
// 5. image
import postImage from './image/image';

export {
	// login
	sendEmail,
	loginEmail,
	loginGoogle,
	loginGithub,
	// profile
	getProfile,
	postProfile,
	// recruit
	recruitList,
	showRecruitBoard,
	registerRecruitBoard,
	editRecruitBoard,
	deleteRecruitBoard,
	registerComment,
	deleteComment,
	//stack
	getStacks,
	//image
	postImage,
};
