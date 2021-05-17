import * as controller from '../controllers/controller';
import express from 'express';
import { upload } from '../middlewares/imageUploader';
const imageRouter = express.Router();

imageRouter.post('/postImage', upload.single('file'), controller.postImage);

export default imageRouter;
