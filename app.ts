import express from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';
import createConnection from './src/index';
import loginRouter from './routes/login';
import authChecker from './middlewares/authChecker';
import profileRouter from './routes/profile';
import recruitRouter from './routes/recruit';
import stacksRouter from './routes/stacks';
dotenv.config();

const PORT = process.env.PORT;

const app = express();
createConnection();

const corsOption = {
	Headers: { 'content-type': 'application/json' },
	origin: '*',
	method: ['post', 'get', 'delete', 'options'],
	credentials: true,
};
app.use(cors(corsOption));

app.use(express.json());

// routes
app.use('/images', express.static('uploads'));
app.use('/', loginRouter);
app.use('/', stacksRouter);
app.use('/', authChecker, profileRouter);
app.use('/', authChecker, recruitRouter);
app.listen(PORT, () => {
	console.log(PORT, '포트 열림');
});

export default app;
