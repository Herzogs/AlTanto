import Router from 'express'
import groupController from '../controllers/group.controller';
import { auth } from '../middlewares/auth.middlewares';

const router = Router();

router.get('/user/:userId', auth, groupController.getGroupsByUserId);
router.get('/:id', auth, groupController.getGroupById);
router.post('/', auth, groupController.createGroup);

router.delete('/:id', auth, groupController.deleteGroup);
router.post('/:id/add-user', auth, groupController.addUserToGroup);
router.delete('/:groupId/remove-user/:userId', auth, groupController.removeUserFromGroup);
router.get('/find/:name', auth, groupController.findGroupsByName); 

//router.post('/notification/', auth, groupController.getGroupsAndNotifications);


export default router;