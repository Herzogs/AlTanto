import Router from 'express';
import userController from '../controllers/user.controller';

const router = Router();

router.get('/:name', userController.getUserByName);

export default router;
