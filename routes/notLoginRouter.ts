import * as controller from '../controllers/controller';
import express from 'express';
const notLoginRouter = express.Router();

// stack 정보 조회
notLoginRouter.get('/stacks', controller.getStacks);
// 팀원모집 게시글 리스트 조회
notLoginRouter.get('/recruitList/:order/:sort', controller.recruitList);
// 팀원모집 게시글 상세내용 조회
notLoginRouter.get('/recruitBoard/:board_id', controller.showRecruitBoard);
// 팀원모집 게시글 리스트 검색 - stacks으로 검색
notLoginRouter.post('/filterRecruitList/:order/:sort', controller.filterRecruitList);

export default notLoginRouter;
