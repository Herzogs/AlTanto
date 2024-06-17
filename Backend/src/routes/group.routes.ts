import Router from 'express'
import GroupController from '../controllers/group.controller';
import { auth } from '../middlewares/auth.middlewares';
import { makeInvoker } from 'awilix-express';

const groupRouter = Router();
const api = makeInvoker(GroupController);

groupRouter.get('/user/:userId', auth, api('getGroupsByUserId'));
groupRouter.get('/:id', auth, api('getGroupById'));
groupRouter.post('/', auth, api('createGroup'));
groupRouter.delete('/:id', auth, api('deleteGroup'));
groupRouter.post('/:id/add-user', auth, api('addUserToGroup'));
groupRouter.delete('/:groupId/remove-user/:userId', auth, api('removeUserFromGroup'));
groupRouter.get('/find/:name', auth, api('findGroupsByName')); 
groupRouter.get('/members/:id', auth, api('getGroupDetailsById'));

//router.post('/notification/', auth, groupController.getGroupsAndNotifications);


export default groupRouter;