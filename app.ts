import express from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';
import createConnection from './src/index';
import loginRouter from './routes/login';
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
app.use((req, res, next) => {
	cors(corsOption);
	next();
});
app.use(express.json());

// routes
app.use('/', loginRouter);

app.listen(PORT, () => {
	console.log(PORT, '포트 열림');
});

export default app;
