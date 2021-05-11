import { emailController } from './controller/sendEmail';
import { emailAuthController } from './controller/loginEmail';
import express from 'express';
const userRouter = express.Router();

// 로그인 - nodemailer
userRouter.post('/sendEmail', emailController);
userRouter.post('/loginEmail', emailAuthController.authorizationCode);

// 로그인 - OAuth 방식: google, github
//
// refresh token으로 새로운 access token 발급

export default userRouter;
