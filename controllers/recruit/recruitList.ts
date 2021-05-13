import { Request, Response } from 'express';
import { Recruits } from '../../src/entity/Recruits';

const recruitList = async (req: Request, res: Response) => {
	// 팀원모집 게시글 리스트 조회
	console.log('💜recruitList- ', req.body, req.params);
	//몇번째 요청인지가 필요해진다. (리크루트목록은 24개 (4*6 또는 3*8)로 모니터크기에따라서 3줄,4줄모두 끝나는 줄이 완벽하게 수평이된다.)
	//get요청에는 body가 없으므로 쿼리로 받으면될까 ?
	// 예를들면 req.params에 몇번째 요청인지가 알수있다면 꺼낼때 최신순으로 24개씩 꺼내면 된다.
	// view카운트가 필요하다. 설령 새로고침으로 올라가더라도 필요하다. 즉 조회가 올때마다, 추가해야한다. (디테일페이지에서 구현해야하며)
	// 리스트를 내려줄때 데이터에 필요하다. 사실상

	try {
		const { order } = req.params;
		const found = await Recruits.find({
			order: {
				createdAt: 'DESC',
			},
		});
		const slicedFound = found.slice((Number(order) - 1) * 24, Number(order) * 24);
		// 0,24
		// 24,48,
		// 48,72
		res.status(200).json({
			boardList: slicedFound,
		});
	} catch (err) {
		console.log('💜recruitList- err: ', err.message);
		res.status(400).json({
			message: err.message,
		});
	}
};

export default recruitList;
