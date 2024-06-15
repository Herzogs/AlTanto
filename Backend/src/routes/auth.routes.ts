import {Router} from "express";
import * as controller from '../controllers/auth.controller';
import validateData from "../middlewares/validateData.middleware";
import {createUser, login} from "../validator/user.validator";

const authRouter = Router();

authRouter.post('/register',validateData(createUser), controller.createUSer);
authRouter.post('/validate-code', controller.confirmUser)
authRouter.post('/login',validateData(login),controller.login)



export default authRouter;