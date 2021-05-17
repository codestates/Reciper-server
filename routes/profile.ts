import * as controller from '../controllers/controller';
import express from 'express';
const profileRouter = express.Router();

// 프로필 정보 조회
profileRouter.get('/profile', controller.getProfile);
// 프로필 정보 저장/수정
profileRouter.post('/profile', controller.postProfile);

export default profileRouter;
