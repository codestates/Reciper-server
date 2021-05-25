import { Request, Response } from 'express';

const showChatRooms = async (req: Request, res: Response) => {
	// 채팅방 목록 조회
	console.log('💚showChatRooms-', req.body, req.params);
};

export default showChatRooms;
