//showKanbanParts
import { Request, Response } from 'express';

const showKanbanParts = async (req: Request, res: Response) => {
	// part 목록 조회
	console.log('💚showKanbanParts-', req.body, req.params);
};

const getPartsList = async (projectURL: string) => {
	// part 목록을 배열 형태로 만들기
	console.log('💚getPartsList-', projectURL);
	let partsList: string[] = [];
	return partsList;
};

export { showKanbanParts, getPartsList };
