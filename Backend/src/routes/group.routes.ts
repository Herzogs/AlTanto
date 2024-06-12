import Router from 'express'
import * as groupController from '../controllers/group.controller';
import { auth } from '../middlewares/auth.middlewares';

const router = Router();

router.get('/user/:userId', auth, groupController.getGroupsByUserId);
router.get('/users/:userName', auth, groupController.getUserByUserName);
router.get('/:id', auth, groupController.getGroupById);
router.post('/', auth, groupController.createGroup);
router.put('/:id', auth, groupController.updateGroupName);
router.delete('/:id', auth, groupController.deleteGroup);
router.post('/:id/add-user', auth, groupController.addUserToGroupWithCode);
router.delete('/:groupId/remove-user/:userId', auth, groupController.removeUserFromGroup);
router.get('/find/:groupName', auth, groupController.findGroupsByName); 

router.post('/notification/', auth, groupController.getGroupsAndNotifications);

export default router;