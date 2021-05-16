import * as controller from '../controllers/controller';
import express from 'express';
const notLoginRouter = express.Router();

// 팀원모집 게시글 리스트 조회
notLoginRouter.get('/recruitList/:order', controller.recruitList);
// 팀원모집 게시글 상세내용 조회
notLoginRouter.get('/recruitBoard/:board_id', controller.showRecruitBoard);

export default notLoginRouter;
