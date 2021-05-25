import { Request, Response } from 'express';

const createChatRoom = async (req: Request, res: Response) => {
	// 채팅방 생성
	console.log('💚createChatRoom-', req.body, req.params);
};

export default createChatRoom;
