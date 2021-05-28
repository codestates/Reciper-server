import { Request, Response } from 'express';

const deleteKanbanPart = async (req: Request, res: Response) => {
	// part 삭제
	console.log('💚deleteKanbanPart-', req.body, req.params);
};

export default deleteKanbanPart;
