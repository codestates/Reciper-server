import 'reflect-metadata';
import { createConnection } from 'typeorm';

createConnection()
	.then(async connection => {
		console.log('DB 연결 완료! ', connection);
	})
	.catch(error => console.log(error));

export default createConnection;
