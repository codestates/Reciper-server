import { Socket } from 'socket.io/dist/socket';
import getUserInfo from './getUserInfo';
import getMemberInfo from './getMemberInfo';

const workspaceChecker = async (socket: Socket, next: Function) => {
	console.log('🔏workspaceChecker-\n', {
		auth: socket.handshake.auth,
		query: socket.handshake.query,
	});
	const projectURL = socket.handshake.query.projectURL as string;
	const { token, loginType } = socket.handshake.auth;
	getUserInfo(token, loginType)
		.then(result => {
			const { userEmail, userId } = result;
			getMemberInfo(userId, projectURL)
				.then(result => {
					const { projectId } = result;
					socket.handshake.query.projectId = String(projectId);
					socket.handshake.query.userId = String(userId);
					console.log('🔏workspaceChecker-go next function!!\n');
					next();
				})
				.catch(err => {
					console.log('🔏workspaceChecker- err:', err.message);
					next(new Error());
				});
		})
		.catch(err => {
			console.log('🔏workspaceChecker- err:', err.message);
			next(new Error());
		});
};

export default workspaceChecker;
