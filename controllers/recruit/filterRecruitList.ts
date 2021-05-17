import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { Recruits } from '../../src/entity/Recruits';

const filterRecruitList = async (req: Request, res: Response) => {
	// 팀원모집 게시글 리스트 검색
	console.log('filterRecruitList- ', req.body, req.params);
};

export default filterRecruitList;
