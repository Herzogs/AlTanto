import {Router} from "express";
import * as controller from '../controllers/zone.controller';
import { auth } from "../middlewares/auth.middlewares";

const router = Router();

router.get('/', auth, controller.getAllZones);
router.post('/', auth, controller.createZone);
router.get('/:id', auth, controller.getZoneById);
router.post('/notification/', auth, controller.reportsByZone);
router.get('/user/:id', auth, controller.getAllZonesByUserId);


export default router;