import 'reflect-metadata';
import { createConnection } from 'typeorm';

createConnection()
	.then(async connection => {
		console.log('📚 DB connect! you can start to work with your entities');
	})
	.catch(error => console.log('📚 DB error!', error));

export default createConnection;
