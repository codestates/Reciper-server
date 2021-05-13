import { Request, Response } from 'express';
import { Users } from '../../src/entity/Users';
import { Stacks } from '../../src/entity/Stacks';

const randomColorGenerator = (): string => {
	const initialColorList: string[] = [
		'#F44336',
		'#E92763',
		'#9C27B0',
		'#673AB7',
		'#3F51B5',
		'#2196F3',
		'#019688',
		'#4CAF50',
		'#60A068',
		'#484A25',
		'#FF981A',
		'#795648',
		'#FF5722',
	];
	return initialColorList[Math.floor(Math.random() * initialColorList.length)]; //0~12
};

const postProfile = async (req: Request, res: Response) => {
	// 프로필 정보 저장/수정
	console.log('🧡postProfile- ', req.body);
	const userId = req.userId;
	const { name, mobile, about_me, git_id, career, stacks, isOpen, profile_image } = req.body;
	const foundUser = await Users.findOne({
		where: {
			id: userId,
		},
	});
	if (foundUser) {
		foundUser.name = name;
		foundUser.mobile = mobile;
		foundUser.about_me = about_me;
		foundUser.git_id = git_id;
		foundUser.career = JSON.stringify(career);
		foundUser.isOpen = isOpen;
		foundUser.profile_image = req.profileImageName ? req.profileImageName : '/image/basic.png';
		foundUser.profile_color = randomColorGenerator();
		const stackArray = [];
		for (let i = 0; i < stacks.length; i++) {
			const foundStack = await Stacks.findOne({
				where: {
					name: stacks[i],
				},
			});
			stackArray.push(foundStack!);
		}
		foundUser.join = stackArray;
		const saved = await foundUser.save();
		console.log(saved, stackArray); // test
		res.status(200).json({
			...saved,
			career: JSON.parse(saved.career),
			stacks: stackArray.map(el => el.name),
		});
	} else {
		res.status(400).json({
			message: 'error no user please login',
		});
	}
};

export default postProfile;
