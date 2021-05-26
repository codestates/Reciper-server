import { Request, Response } from 'express';
import { Users } from '../../src/entity/Users';
import { Projects } from '../../src/entity/Projects';
import { Rooms } from '../../src/entity/Rooms';
import randomColorGenerator from '../login/randomColorGenerator';

const createProject = async (req: Request, res: Response) => {
	// 프로젝트 생성
	console.log('💛createProject-');
	console.log(req.body, req.params);
	const userId = req.userId;
	const { name, projectURL } = req.body;
	// 유저 정보 가져오기
	const userInfo = await Users.findOne({
		id: userId,
	});
	if (userInfo) {
		// 새로운 프로젝트 정보 저장
		const created = await Projects.create({
			name,
			projectURL,
			projectColor: randomColorGenerator(),
			inviteList: '[]',
		});
		const membersArray = [userInfo];
		created.members = membersArray;
		try {
			await created.save();
			// chat room - General 생성
			let generalRoom = await Rooms.create({
				name: 'General',
				project: created,
			});
			await generalRoom.save();
			console.log('💛createProject-result:', created); // test
			res.status(200).json({
				...created,
				members: created.members.map(el => el.id),
			});
		} catch (err) {
			// 만약 projectURL에 중복되는 value를 저장하면 에러 발생(QueryFailedError: Duplicate entry)
			console.log('💛createProject-err:', err.message);
			res.status(400).json({
				message: err.message,
			});
		}
	}
};

export default createProject;
