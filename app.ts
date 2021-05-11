import express from 'express';

const app = express();
//.env
const PORT = 4000;

app.listen(PORT, () => {
	console.log(PORT, '포트 열림');
});
