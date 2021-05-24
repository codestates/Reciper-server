import { Socket } from '../node_modules/socket.io/dist/socket';
import getUserInfo from './getUserInfo';
import { Projects } from '../src/entity/Projects';

const chatChecker = async (socket: Socket, next: Function) => {
	console.log('🔏chatChecker 실행합니다-\n', socket.handshake.auth, '\n', socket.handshake.query);
	const { projectURL } = socket.handshake.query;
	const { token, logintype } = socket.handshake.auth;
	getUserInfo(token, logintype)
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
					console.log('🔏', projectURL, 'member:', chkMembers); // test
					if (chkMembers.includes(userId)) {
						console.log('🔏chatChecker 결과- ', userId, 'is member in', projectURL);
						socket.handshake.query.projectId = String(foundProject.id);
						socket.handshake.query.userId = String(userId);
						// 실제 요청으로 넘어감
						console.log('🔏go next function!!\n');
						next();
					} else {
						console.log('🔏chatChecker- err:', userId, ' is not member in ', projectURL);
						next(new Error());
					}
				} else {
					console.log('🔏chatChecker- err:', projectURL, ' project is not found');
					next(new Error());
				}
			} catch (err) {
				console.log('🔏chatChecker- err:', err.message);
				next(new Error());
			}
		})
		.catch(err => {
			console.log('🔏chatChecker- err:', err.message);
			next(new Error());
		});
};

export default chatChecker;
