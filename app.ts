import express from 'express';
import * as dotenv from 'dotenv';
dotenv.config();
import createConnection from './src/index';
import loginRouter from './routes/login';

const PORT = process.env.PORT;

const app = express();
createConnection();

app.use('/', loginRouter);

app.listen(PORT, () => {
	console.log(PORT, '포트 열림');
});
