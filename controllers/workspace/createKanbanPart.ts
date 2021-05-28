import { Request, Response } from 'express';

const createKanbanPart = async (req: Request, res: Response) => {
	// part 생성
	console.log('💚createKanbanPart-', req.body, req.params);
};

export default createKanbanPart;
