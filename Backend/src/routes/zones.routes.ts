import {Router} from "express";
import * as controller from '../controllers/zone.controller';

const router = Router();

router.get('/',  controller.getAllZones);
router.post('/',  controller.createZone);
router.get('/:id', controller.getZoneById);


export default router;