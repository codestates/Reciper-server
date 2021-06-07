import { Projects } from '../src/entity/Projects';

const getMemberInfo = async (userId: number, projectURL: string | string[]) => {
	console.log('🔎getMemberInfo-start');
	const result = {
		projectId: -1,
	};
	try {
		const foundProject = await Projects.findOne({
			relations: ['members'],
			where: {
				projectURL,
			},
		});
		if (foundProject) {
			const chkMembers = foundProject.members.map(el => el.id);
			//console.log('🔎getMemberInfo-chk:', projectURL, 'member:', chkMembers);
			if (chkMembers.includes(userId)) {
				console.log('🔎getMemberInfo-result:', userId, 'is member in', projectURL);
				result.projectId = foundProject.id;
			} else {
				console.log('🔎getMemberInfo-err:', userId, 'is not member in', projectURL);
				throw new Error(userId + ' is not member in ' + projectURL);
			}
		} else {
			console.log('🔎getMemberInfo-err:', projectURL, 'project is not found');
			throw new Error(projectURL + ' project is not found');
		}
	} catch (err) {
		console.log('🔎getMemberInfo-err:', err.message);
		throw new Error(err);
	}
	return result;
};

export default getMemberInfo;
