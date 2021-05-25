import { Request, Response } from 'express';

const deleteChatRoom = async (req: Request, res: Response) => {
	// 채팅방 삭제
	console.log('💚deleteChatRoom-', req.body, req.params);
};

export default deleteChatRoom;
