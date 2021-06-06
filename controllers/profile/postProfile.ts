import { Request, Response } from 'express';
import { Users } from '../../src/entity/Users';
import { Stacks } from '../../src/entity/Stacks';
import * as fs from 'fs';
import randomColorGenerator from '../login/randomColorGenerator';

const postProfile = async (req: Request, res: Response) => {
	// 프로필 정보 저장/수정
	console.log('🧡postProfile-', req.body);
	const userId = req.userId;
	const { name, mobile, aboutMe, gitId, career, stacks, isOpen, uploadImage } = req.body;
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
		if (uploadImage) {
			// 기존 이미지 파일 삭제하기
			const imageRoute = foundUser.uploadImage;
			fs.access(`${__dirname}/../../uploads/${imageRoute}`, fs.constants.F_OK, err => {
				if (err) {
					return console.log('🧡postProfile-err: 삭제할 수 없는 파일입니다', err.message);
				}
				fs.unlink(`${__dirname}/../../uploads/${imageRoute}`, err => {
					if (err) {
						console.log('🧡postProfile-err:', err.message);
					}
				});
			});
			if (uploadImage === 'deleteImage') {
				foundUser.uploadImage = '';
			} else {
				foundUser.uploadImage = uploadImage;
			}
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
