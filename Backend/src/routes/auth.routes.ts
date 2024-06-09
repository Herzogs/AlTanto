import {Router} from "express";
import * as controller from '../controllers/auth.controller';
import validateData from "../middlewares/validateData.middleware";
import {createUser, login} from "../validator/user.validator";

const router = Router();

router.post('/register',validateData(createUser), controller.createUSer);
router.post('/validate-code', controller.confirmUser)
router.post('/login',validateData(login),controller.login)

export default router;