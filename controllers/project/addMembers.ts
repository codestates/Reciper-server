import { Request, Response } from 'express';
import { Users } from '../../src/entity/Users';
import { Projects } from '../../src/entity/Projects';

const addMembers = async (req: Request, res: Response) => {
	// 프로젝트 참가(팀원 초대 응답)
	console.log('💛addMembers-', req.body);
	const { email, authorizationCode, projectURL } = req.body;
	try {
		const foundProject = await Projects.findOne({
			relations: ['members'],
			where: {
				projectURL,
			},
		});
		if (foundProject) {
			// 초대 명단에 해당 email이 있는지 확인
			let inviteList = JSON.parse(foundProject.inviteList);
			//console.log(inviteList);
			let isInvited = false;
			for (let idx = 0; idx < inviteList.length; idx++) {
				if (inviteList[idx] === email) {
					const userInfo = await Users.findOne({
						email,
					});
					if (userInfo) {
						// 이미 member인지 확인
						const membersArray = [...foundProject.members];
						const chkMembers = membersArray.map(el => el.id);
						//console.log('💛addMembers-chk:', foundProject.projectURL, 'member:', chkMembers); // test
						if (!chkMembers.includes(userInfo.id)) {
							membersArray.push(userInfo);
							foundProject.members = membersArray;
							inviteList.splice(idx, 1);
							foundProject.inviteList = JSON.stringify(inviteList);
							await foundProject.save();
							isInvited = true;
						} else {
							console.log('💛addMembers-err:', email, 'already member of the project');
							res.status(400).json({
								message: email + ' already member of the project',
							});
							return;
						}
					}
					break;
				}
			}
			if (isInvited) {
				res.status(200).json({
					...foundProject,
					members: foundProject.members.map(el => {
						return {
							id: el.id,
							name: el.name,
						};
					}),
				});
			} else {
				console.log('💛addMembers-err: invalid invitation memeber' + email);
				res.status(400).json({
					message: 'invalid invitation memeber ' + email,
				});
			}
		} else {
			console.log('💛addMembers-err: no data about project' + projectURL);
			res.status(400).json({
				message: 'no data about project ' + projectURL,
			});
		}
	} catch (err) {
		console.log('💛addMembers-err:', err.message);
		res.status(400).json({
			message: err.message,
		});
	}
};

export default addMembers;
