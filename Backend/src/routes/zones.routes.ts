import { Router } from "express";
import * as controller from '../controllers/zone.controller';
import {auth} from "../middlewares/auth.middlewares";
const router = Router();

router.get('/',auth, controller.getAllZones);
router.post('/',auth, controller.createZone);
router.get('/:id',auth, controller.getZoneById);



export default router;