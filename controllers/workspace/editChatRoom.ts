import { Request, Response } from 'express';

const editChatRoom = async (req: Request, res: Response) => {
	// 채팅방 이름 수정
	console.log('💚editChatRoom-', req.body, req.params);
};

export default editChatRoom;
