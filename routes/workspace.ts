import * as controller from '../controllers/controller';
import express from 'express';
import authChecker from '../middlewares/authChecker';
import memberChecker from '../middlewares/memberChecker';
const workspaceRouter = express.Router();

export default workspaceRouter;
