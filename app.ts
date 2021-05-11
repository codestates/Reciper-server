import express from 'express';
import * as dotenv from 'dotenv';
import createConnection from './src/index';
dotenv.config();
const PORT = process.env.PORT;
const app = express();
createConnection();

app.listen(PORT, () => {
	console.log(PORT, '포트 열림');
});
