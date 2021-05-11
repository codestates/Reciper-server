import express from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';
dotenv.config();
import createConnection from './src/index';
import loginRouter from './routes/login';

const PORT = process.env.PORT;

const app = express();
createConnection();

const corsOption = {
	Headers: { 'content-type': 'application/json' },
	origin: true,
	method: ['post', 'get', 'delete', 'options'],
	credentials: true,
};
app.use(cors(corsOption));
app.use(express.json());
app.use('/', loginRouter);

app.listen(PORT, () => {
	console.log(PORT, '포트 열림');
});
