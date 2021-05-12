import { Request, Response } from 'express';
import { Users } from '../../src/entity/Users';

const postProfile = async (req: Request, res: Response) => {
	// 프로필 정보 저장/수정
	console.log('🧡postProfile- ', req.body);
	//8,9번줄은 authChecker에서 얻을수있게됩니다. 지금은 하드코딩 되어있습니다.
	const user_Id = 3;
	const user_Email = 'nsg8957@naver.com';
	// req.body = {
	// 	name:"신승길",
	// 	mobile:"010-1234-5678",
	// 	about_me:"성장하는개발자가 되자",
	// 	git_id:"gatsukichi",
	// 	career:['코드스테이츠','인턴','6개월'],
	// 	isOpen:true,
	// 	profile_image:이미지파일.jpg
	// }
	const { name, mobile, about_me, git_id, career, isOpen, profile_image } = req.body;
	// JSON.stringify(career);
	const foundUser = await Users.findOne({ where: { id: user_Id } });
	if (foundUser) {
		foundUser.name = name;
		foundUser.mobile = mobile;
		foundUser.about_me = about_me;
		foundUser.git_id = git_id;
		foundUser.career = JSON.stringify(career);
		foundUser.isOpen = isOpen;
		foundUser.profile_image = req.profileImageName ? req.profileImageName : '/image/basic.png';

		const saved = await foundUser.save();

		res.status(200).json({ message: 'success', body: saved });
	} else {
		res.status(400).json({ message: 'err no user plz login' });
	}
};

export default postProfile;
