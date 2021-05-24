import { Request, Response } from 'express';
import { Stacks } from '../../src/entity/Stacks';

const getStacks = async (req: Request, res: Response) => {
	// 스택 리스트 요청
	console.log('🤍getStacks-', req.body, req.query);
	const q = req.query.q;
	if (q) {
		console.log('쿼리있음', q);
		try {
			const found = await Stacks.find();
			const filtered = found.filter(el => {
				if (q.length === 1) {
					const regExp = new RegExp(`(^${q})`, 'ig');
					return el.name.match(regExp);
				} else {
					const regExp = new RegExp(`(${q})`, 'ig');
					return el.name.match(regExp);
				}
			});
			res.status(200).json({
				data: filtered,
			});
		} catch (err) {
			res.status(500).json({
				message: err.message,
			});
		}
	} else {
		console.log('쿼리없음', q);
		try {
			const found = await Stacks.find();
			res.status(200).json({
				data: found,
			});
		} catch (err) {
			res.status(500).json({
				message: err.message,
			});
		}
	}
};

export default getStacks;
