import Router from 'express';
import userController from '../controllers/user.controller';
import { makeInvoker } from 'awilix-express';

const userRouter = Router();
const api = makeInvoker(userController);

userRouter.get('/:name', api('getUserByName'));
userRouter.get('/id/:id', api('getUserById'));
userRouter.put('/id/:id', api('updateUser'));

export default userRouter;
