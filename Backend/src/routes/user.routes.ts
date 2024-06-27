import Router from 'express';
import userController from '../controllers/user.controller';
import { makeInvoker } from 'awilix-express';

const userRouter = Router();
const api = makeInvoker(userController);

userRouter.get('/:name', api('getUserByName'));
userRouter.get('/:id', api('getUserById'));
userRouter.put('/:id', api('updateUser'));

export default userRouter;
