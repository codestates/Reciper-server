import * as controller from '../controllers/controller';
import express from 'express';
const notLoginRouter = express.Router();

// stack 정보 조회
notLoginRouter.get('/stacks', controller.getStacks);
// 팀원모집 게시글 리스트 조회
notLoginRouter.get('/recruitList/:order', controller.recruitList);
// 팀원모집 게시글 상세내용 조회
notLoginRouter.get('/recruitBoard/:board_id', controller.showRecruitBoard);
// 팀원모집 게시글 리스트 검색
notLoginRouter.post('/filterRecruitList', controller.filterRecruitList);

export default notLoginRouter;
