import { Request, Response } from 'express';
import { Users } from '../../src/entity/Users';
import { Projects } from '../../src/entity/Projects';

const addMembers = async (req: Request, res: Response) => {
	// 프로젝트 참가(팀원 초대 응답)
	console.log('💛addMembers- ');
	console.log(req.body, req.params);
	const email = req.body.email;
	const authorizationCode = req.body.authorizationCode;
	const projectURL = req.body.projectURL;
	try {
		const foundProject = await Projects.findOne({
			where: {
				projectURL,
			},
		});
		if (foundProject) {
			let inviteList = JSON.parse(foundProject.inviteList);
			let isInvited = false;
			for (let idx = 0; idx < inviteList.length; idx++) {
				if (inviteList[idx] === email) {
					const userInfo = await Users.findOne({
						email,
					});
					if (userInfo) {
						const membersArray = [...foundProject.members];
						membersArray.push(userInfo);
						foundProject.members = membersArray;
						inviteList = inviteList.splice(idx, 1);
						foundProject.inviteList = JSON.stringify(inviteList);
						await foundProject.save();
						isInvited = true;
					}
					break;
				}
			}
			if (isInvited) {
				console.log(foundProject); //test
				res.status(200).json({
					...foundProject,
				});
			} else {
				res.status(400).json({
					message: 'invalid invitation memeber ' + email,
				});
			}
		} else {
			res.status(400).json({
				message: 'no data about project ' + projectURL,
			});
		}
	} catch (err) {
		console.log('💛addMembers- err: ', err.message);
		res.status(400).json({
			message: err.message,
		});
	}
};

export default addMembers;
