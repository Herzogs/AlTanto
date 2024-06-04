import { Router } from "express";
import * as groupController from '../controllers/group.controller';
import { auth } from "../middlewares/auth.middlewares";

const router = Router();


router.get('/user/:userId', auth, groupController.getGroupsByUserIdController);

router.post('/', auth, groupController.createGroup);

router.put('/:id', auth, groupController.updateGroupName);

router.delete('/:id', auth, groupController.deleteGroup);

router.post('/:id/add-user', auth, groupController.addUserToGroup);

router.delete('/:id/remove-user/:userId', auth, groupController.removeUserFromGroup);

export default router;
