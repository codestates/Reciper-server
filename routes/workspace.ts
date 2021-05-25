import * as controller from '../controllers/controller';
import express from 'express';
import authChecker from '../middlewares/authChecker';
import memberChecker from '../middlewares/memberChecker';
const workspaceRouter = express.Router();

// middleware
workspaceRouter.use('/workspace', authChecker, memberChecker);

// 6. chat(채팅)
// 채팅방 목록 조회
workspaceRouter.get('/workspace/chat/:projectURL', controller.showChatRooms);
// 채팅방 생성
workspaceRouter.post('/workspace/chat/:projectURL', controller.createChatRoom);
// 채팅방 이름 수정
workspaceRouter.post('/workspace/chat/:projectURL/:room', controller.editChatRoom);
// 채팅방 삭제
workspaceRouter.delete('/workspace/chat/:projectURL/:room', controller.deleteChatRoom);

export default workspaceRouter;
