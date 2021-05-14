import * as controller from '../controllers/controller';
import express from 'express';
import { upload } from '../middlewares/imageUploader';
const profileRouter = express.Router();

// 프로필 정보 조회
profileRouter.get('/profile', controller.getProfile);
// 프로필 정보 저장/수정
profileRouter.post('/profile', upload.single('file'), controller.postProfile);

export default profileRouter;
