import Router from 'express'
import * as groupController from '../controllers/group.controller';

const router = Router();

router.get('/', groupController.getAllGroups);
router.get('/:id', groupController.getGroupById);
router.post('/', groupController.createGroup);

export default router;