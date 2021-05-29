import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { Recruits } from '../../src/entity/Recruits';

const recruitList = async (req: Request, res: Response) => {
	// 팀원모집 게시글 리스트 조회 - filterRecruitList로 대체 가능
	console.log('💜recruitList-', req.body, req.params);
	try {
		const order = Number(req.params.order);
		const sort = req.params.sort === 'ASC' ? 1 : -1;
		const allBoards = await getRepository(Recruits).find({
			relations: ['writer', 'stacks'],
			order: {
				createdAt: sort,
			},
		});
		const sliceBoards = allBoards.slice((order - 1) * 24, order * 24);
		const boardList = [];
		for (let idx = 0; idx < sliceBoards.length; idx++) {
			let requireStack = sliceBoards[idx].stacks.map(el => el.name);
			const obj = { ...sliceBoards[idx], requireStack };
			boardList.push(obj);
		}
		res.status(200).json({
			boardList,
		});
	} catch (err) {
		console.log('💜recruitList-err:', err.message);
		res.status(400).json({
			message: err.message,
		});
	}
};

export default recruitList;
