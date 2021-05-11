import * as controller from '../controllers/controller';
import express from 'express';
const loginRouter = express.Router();

// 로그인 - OAuth 방식: google, github
loginRouter.post('/loginGoogle', controller.loginGoogle);
loginRouter.post('/loginGithub', controller.loginGithub);

export default loginRouter;
