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
	console.log('🧡postProfile- ');
	console.log(req.body, req.profileImageName);
	const userId = req.userId;
	const { name, mobile, aboutMe, gitId, career, stacks, isOpen } = req.body;
	const foundUser = await Users.findOne({
		where: {
			id: userId,
		},
	});
	if (foundUser) {
		if (name) {
			foundUser.name = name;
		}
		if (mobile) {
			foundUser.mobile = mobile;
		}
		if (aboutMe) {
			foundUser.aboutMe = aboutMe;
		}
		if (gitId) {
			foundUser.gitId = gitId;
		}
		if (career) {
			foundUser.career = JSON.stringify(career);
		}
		if (foundUser) {
			foundUser.isOpen = isOpen;
		}
		if (req.profileImageName) {
			foundUser.profileImage = req.profileImageName;
		}
		foundUser.profileColor = randomColorGenerator();
		const stackArray = [];
		if (stacks) {
			for (let i = 0; i < stacks.length; i++) {
				const foundStack = await Stacks.findOne({
					where: {
						name: stacks[i],
					},
				});
				stackArray.push(foundStack!);
			}
		}

		foundUser.stacks = stackArray;
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
