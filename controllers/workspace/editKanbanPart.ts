import { Request, Response } from 'express';

const editKanbanPart = async (req: Request, res: Response) => {
	// part 이름 수정
	console.log('💚editKanbanPart-', req.body, req.params);
};

export default editKanbanPart;
