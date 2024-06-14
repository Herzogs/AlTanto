import Router from 'express'
import * as groupController from '../controllers/group.controller';
import { auth } from '../middlewares/auth.middlewares';

const groupRouter = Router();

groupRouter.get('/user/:userId', auth, groupController.getGroupsByUserId);
groupRouter.get('/users/:userName', auth, groupController.getUserByUserName);
groupRouter.get('/:id', auth, groupController.getGroupById);
groupRouter.post('/', auth, groupController.createGroup);
groupRouter.put('/:id', auth, groupController.updateGroupName);
groupRouter.delete('/:id', auth, groupController.deleteGroup);
groupRouter.post('/:id/add-user', auth, groupController.addUserToGroupWithCode);
groupRouter.delete('/:groupId/remove-user/:userId', auth, groupController.removeUserFromGroup);
groupRouter.get('/find/:groupName', auth, groupController.findGroupsByName); 
groupRouter.post('/notification/', auth, groupController.getGroupsAndNotifications);

export default groupRouter;