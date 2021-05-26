import * as controller from '../controllers/controller';
import express from 'express';
import authChecker from '../middlewares/authChecker';
import projectChecker from '../middlewares/projectChecker';
const projectRouter = express.Router();

// middleware

projectRouter.use('/project', authChecker);
projectRouter.use('/project/:projectURL', projectChecker);
projectRouter.use('/projectInvite', authChecker, projectChecker);


// 프로젝트 리스트 조회
projectRouter.get('/project', controller.showProjectList);
// 프로젝트 생성
projectRouter.post('/project', controller.createProject);
// 프로젝트 조회
projectRouter.get('/project/:projectURL', controller.showProject);
// 프로젝트 수정
projectRouter.post('/project/:projectURL', controller.editProject);
// 프로젝트 삭제
projectRouter.delete('/project/:projectURL', controller.deleteProject);
// 프로젝트 팀원 초대
projectRouter.post('/projectInvite/:projectURL', controller.inviteMembers);
// 프로젝트 참가(팀원 초대 응답)
projectRouter.post('/projectParticipate', controller.addMembers);

export default projectRouter;
