import * as controller from '../controllers/controller';
import express from 'express';
import { upload } from '../middlewares/imageUploader';
const recruitRouter = express.Router();

// 팀원모집 게시글 등록
recruitRouter.post('/recruitBoard', upload.single('file'), controller.registerRecruitBoard);
// 팀원모집 게시글 수정
recruitRouter.post('/recruitBoard/:board_id', upload.single('file'), controller.editRecruitBoard);
// 팀원모집 게시글 삭제
recruitRouter.delete('/recruitBoard/:board_id', controller.deleteRecruitBoard);
// 댓글 등록
recruitRouter.post('/recruitBoardComment/:board_id', controller.registerComment);
// 댓글 삭제
recruitRouter.delete('/recruitBoardComment/:board_id/:comment_id', controller.deleteComment);

export default recruitRouter;
