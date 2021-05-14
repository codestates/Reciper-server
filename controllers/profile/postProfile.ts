import { Request, Response } from 'express';
import { Users } from '../../src/entity/Users';
import { Stacks } from '../../src/entity/Stacks';
import * as fs from 'fs';

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
	console.log(req.body, req.uploadImageName);
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
		if (career !== undefined && career !== '') {
			foundUser.career = JSON.stringify(career);
		}
		if (foundUser) {
			foundUser.isOpen = isOpen;
		}
		if (req.uploadImageName) {
			const imageRoute = foundUser.profileImage;
			fs.access(`${__dirname}/../../uploads/${imageRoute}`, fs.constants.F_OK, err => {
				if (err) {
					return console.log('삭제할 수 없는 파일입니다', err.message);
				}
				fs.unlink(`${__dirname}/../../uploads/${imageRoute}`, err =>
					err
						? console.log(err.message)
						: console.log(`${__dirname}/../../uploads/${imageRoute} 를 정상적으로 삭제했습니다`),
				);
			});
			foundUser.profileImage = req.uploadImageName;
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
			career: career !== undefined && career !== '' ? JSON.parse(saved.career) : '{}',
			stacks: stackArray.map(el => el.name),
		});
	} else {
		res.status(400).json({
			message: 'error no user please login',
		});
	}
};

export default postProfile;
