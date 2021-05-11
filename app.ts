import express from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';
import createConnection from './src/index';
import userRouter from './route'
dotenv.config();
import loginRouter from './routes/login';

const PORT = process.env.PORT;

const app = express();
createConnection();

const corsOption = {
	Headers: { 'content-type': 'application/json' },
	origin: '*',
	method: ['post', 'get', 'delete', 'options'],
	credentials: true,
};
app.use((req,res,next)=>{
	cors(corsOption);
	next();
});
app.use(express.json());
app.use('/', loginRouter);

app.use('/', userRouter);

app.listen(PORT, () => {
	console.log(PORT, '포트 열림');
});

export default app;
