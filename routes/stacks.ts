import * as controller from '../controllers/controller';
import express from 'express';
const stacksRouter = express.Router();

stacksRouter.get('/stacks', controller.getStacks);

export default stacksRouter;
