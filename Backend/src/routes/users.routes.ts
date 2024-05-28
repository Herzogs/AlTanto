import { Router } from "express";
import * as controller from '../controllers/user.controller';

const router = Router();

router.post('/register', controller.createUSer);
router.post('/validate-code',controller.confirmUser)
export default router;