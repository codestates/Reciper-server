import * as controller from '../controllers/controller';
import express from 'express';
const profileRouter = express.Router();
import { upload } from '../controllers/profile/imageUploader';

// 프로필 정보 조회
profileRouter.get('/profile', controller.getProfile);
// 프로필 정보 저장/수정
profileRouter.post('/profile', upload.single('file'), controller.postProfile);

export default profileRouter;
