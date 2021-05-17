import * as controller from '../controllers/controller';
import express from 'express';
import authChecker from '../middlewares/authChecker';
const profileRouter = express.Router();

profileRouter.use('/profile', (req, res, next) => {
	authChecker(req, res, next);
});

// 프로필 정보 조회
profileRouter.get('/profile', controller.getProfile);
// 프로필 정보 저장/수정
profileRouter.post('/profile', controller.postProfile);

export default profileRouter;
