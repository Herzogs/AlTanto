import Router from 'express';
import userController from '../controllers/user.controller';
import { makeInvoker } from 'awilix-express';
import { auth } from '../middlewares/auth.middlewares';
const userRouter = Router();
const api = makeInvoker(userController);

userRouter.get('/:id', auth, api('getUserById'));
userRouter.get('/name/:name', auth, api('getUserByName'));
userRouter.put('/update/:id', auth, api('updateUser'));

export default userRouter;
