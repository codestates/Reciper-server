import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import * as dotenv from 'dotenv';
import createConnection from './src/index';
import loginRouter from './routes/login';
import notLoginRouter from './routes/notLoginRouter';
import imageRouter from './routes/image';
import profileRouter from './routes/profile';
import recruitRouter from './routes/recruit';
import projectRouter from './routes/project';
import workspaceRouter from './routes/workspace';

dotenv.config();

const app = express();
createConnection();

const corsOption = {
	Headers: { 'content-type': 'application/json' },
	origin: true,
	method: ['post', 'get', 'delete', 'options'],
	credentials: true,
};
app.use(cors(corsOption));
app.use(cookieParser());
app.use(express.urlencoded({
	extended: true
}));
app.use(express.json());

// routes
app.use('/', loginRouter);
app.use('/', notLoginRouter);
app.use('/', imageRouter);
app.use('/images', express.static('uploads'));
app.use('/', profileRouter);
app.use('/', recruitRouter);
app.use('/', projectRouter);
app.use('/', workspaceRouter);

export default app;
