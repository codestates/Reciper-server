import app from './app';
import * as dotenv from 'dotenv';
dotenv.config();

const PORT = process.env.PORT;

const server = require('./socket');

server.listen(PORT, () => {
	console.log(`🚀 reciper server listening on ${PORT}`);
});
