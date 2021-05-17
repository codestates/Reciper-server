import * as controller from '../controllers/controller';
import express from 'express';
import { upload } from '../middlewares/imageUploader';
const imageRouter = express.Router();

// 이미지 업로드
imageRouter.post('/postImage', upload.single('file'), controller.postImage);

export default imageRouter;
