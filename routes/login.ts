import * as controller from '../controllers/controller';
import express from 'express';
const loginRouter = express.Router();

// 로그인 - nodemailer
loginRouter.post('/sendEmail', controller.sendEmail);
loginRouter.post('/loginEmail', controller.loginEmail.authorizationCode);
// 로그인 - OAuth 방식: google, github
loginRouter.post('/loginGoogle', controller.loginGoogle);
loginRouter.post('/loginGithub', controller.loginGithub);
// 새로운 access token 발급하기
loginRouter.get('/newAccessToken', controller.getNewAccessToken);

export default loginRouter;
