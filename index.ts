import app from './app';
import * as dotenv from 'dotenv';
dotenv.config();
const PORT = process.env.PORT;

// app.listen(PORT, () => {
// 	console.log(PORT, '포트 열림');
// });

const server = require('./socket');

server.listen(PORT, () => {
	console.log(`🚀 server listening on ${4000}`);
});
