import * as controller from '../controllers/controller';
import express from 'express';
import authChecker from '../middlewares/authChecker';
import projectChecker from '../middlewares/projectChecker';
const workspaceRouter = express.Router();

// middleware
workspaceRouter.use('/workspace/:projectURL', authChecker, projectChecker);

// 5-1. chat(채팅)
// 채팅방 목록 조회
workspaceRouter.get('/workspace/:projectURL/chat', controller.showChatRooms);
// 채팅방 생성
workspaceRouter.post('/workspace/:projectURL/chat', controller.createChatRoom);
// 채팅방 이름 수정
workspaceRouter.post('/workspace/:projectURL/chat/:room', controller.editChatRoom);
// 채팅방 삭제
workspaceRouter.delete('/workspace/:projectURL/chat/:room', controller.deleteChatRoom);

// 5-2. tasks(칸반보드, 캘린더)
// part 목록 조회
workspaceRouter.get('/workspace/:projectURL/kanban', controller.showKanbanParts);
// part 생성
workspaceRouter.post('/workspace/:projectURL/kanban', controller.createKanbanPart);
// part 이름 수정
workspaceRouter.post('/workspace/:projectURL/kanban/:part', controller.editKanbanPart);
// part 삭제
workspaceRouter.delete('/workspace/:projectURL/kanban/:part', controller.deleteKanbanPart);

export default workspaceRouter;
