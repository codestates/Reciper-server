import { Socket } from 'socket.io/dist/socket';
import getUserInfo from './getUserInfo';
import { Projects } from '../src/entity/Projects';

const workspaceChecker = async (socket: Socket, next: Function) => {
	console.log('🔏workspaceChecker-\n', {
		auth: socket.handshake.auth,
		query: socket.handshake.query,
	});
	const { projectURL } = socket.handshake.query;
	const { token, loginType } = socket.handshake.auth;
	getUserInfo(token, loginType)
		.then(async result => {
			const { userEmail, userId } = result;
			try {
				const foundProject = await Projects.findOne({
					relations: ['members'],
					where: {
						projectURL,
					},
				});
				if (foundProject) {
					const chkMembers = foundProject.members.map(el => el.id);
					console.log('🔏workspaceChecker-chk:', projectURL, 'member:', chkMembers); // test
					if (chkMembers.includes(userId)) {
						console.log('🔏workspaceChecker-result:', userId, 'is member in', projectURL);
						socket.handshake.query.projectId = String(foundProject.id);
						socket.handshake.query.userId = String(userId);
						// 실제 요청으로 넘어감
						console.log('🔏workspaceChecker-go next function!!\n');
						next();
					} else {
						console.log('🔏workspaceChecker-err:', userId, 'is not member in', projectURL);
						next(new Error());
					}
				} else {
					console.log('🔏workspaceChecker-err:', projectURL, 'project is not found');
					next(new Error());
				}
			} catch (err) {
				console.log('🔏workspaceChecker-err:', err.message);
				next(new Error());
			}
		})
		.catch(err => {
			console.log('🔏workspaceChecker- err:', err.message);
			next(new Error());
		});
};

export default workspaceChecker;
