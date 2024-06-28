import Router from 'express'
import GroupController from '../controllers/group.controller';
//import { auth } from '../middlewares/auth.middlewares';
import { makeInvoker } from 'awilix-express';

const groupRouter = Router();
const api = makeInvoker(GroupController);

groupRouter.get('/user/:userId', api('getGroupsByUserId'));
groupRouter.get('/:id', api('getGroupById'));
groupRouter.post('/', api('createGroup'));
groupRouter.delete('/:id', api('deleteGroup'));
groupRouter.post('/:id/add-user', api('addUserToGroup'));
groupRouter.delete('/:groupId/remove-user/:userId', api('removeUserFromGroup'));
groupRouter.get('/find/:name', api('findGroupsByName')); 
groupRouter.get('/members/:id', api('getGroupDetailsById'));
groupRouter.get('/notifications/:id', api('getGroupNotifications'));
groupRouter.post('/sos', api('sendSOS'));


export default groupRouter;