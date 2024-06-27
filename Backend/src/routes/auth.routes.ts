import {Router} from "express";
import controller from '../controllers/auth.controller';
import validateData from "../middlewares/validateData.middleware";
import {createUser, login, updatePassword} from "../validator/user.validator";
import { makeInvoker } from "awilix-express";

const authRouter = Router();
const api = makeInvoker(controller)

authRouter.post('/register',validateData(createUser), api('createUSer'));
authRouter.post('/validate-code', api('confirmUser'))
authRouter.post('/login',validateData(login),api('login'))
authRouter.post('/recovery',api('recovery'))
authRouter.post('/update-password',validateData(updatePassword),api('updatePassword'))



export default authRouter;