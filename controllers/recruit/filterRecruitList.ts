import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { Recruits } from '../../src/entity/Recruits';

const filterRecruitList = async (req: Request, res: Response) => {
	// 팀원모집 게시글 리스트 검색
	console.log('💜filterRecruitList-', req.body, req.params);
	const searchStacksList = req.body.searchStacksList;
	const order = Number(req.params.order);
	const sort = req.params.sort === '오래된 순' ? 1 : -1;
	// 주어진 stack을 포함하는 게시글 리스트 조회
	try {
		const allBoards = await getRepository(Recruits).find({
			relations: ['writer', 'stacks'],
			order: {
				createdAt: sort,
			},
		});
		let filterResult = [];
		for (let idx = 0; idx < allBoards.length; idx++) {
			let requireStack = allBoards[idx].stacks.map(el => el.name);
			let isRight = true;
			for (let chk = 0; chk < searchStacksList.length; chk++) {
				if (!requireStack.includes(searchStacksList[chk])) {
					isRight = false;
					break;
				}
			}
			if (isRight) {
				const obj = { ...allBoards[idx], requireStack };
				filterResult.push(obj);
			}
		}
		const countTotal = filterResult.length;
		res.status(200).json({
			boardList: filterResult.slice((order - 1) * 24, order * 24),
			isEnd: countTotal <= order * 24 ? true : false,
		});
	} catch (err) {
		console.log('💜filterRecruitList-err:', err.message);
		res.status(400).json({
			message: err.message,
		});
	}
};

export default filterRecruitList;
