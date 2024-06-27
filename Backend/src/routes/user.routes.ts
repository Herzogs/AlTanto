import Router from 'express';
import userController from '../controllers/user.controller';
import { makeInvoker } from 'awilix-express';

const userRouter = Router();
const api = makeInvoker(userController);

userRouter.get('/:id', api('getUserById'));
userRouter.get('/name/:name', api('getUserByName'));
userRouter.put('/update/:id', api('updateUser'));

export default userRouter;
