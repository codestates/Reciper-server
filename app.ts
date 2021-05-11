import express from 'express';
import * as dotenv from 'dotenv';
import createConnection from './src/index';
import userRouter from './route';
import cors from 'cors';
dotenv.config();
const PORT = process.env.PORT;
const app = express();
createConnection();

app.use(express.json());
app.use(cors());
app.use('/', userRouter);

app.listen(PORT, () => {
	console.log(PORT, '포트 열림');
});

export default app;
