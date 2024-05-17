import { Router } from "express";
import * as controller from '../controllers/zone.controller';
const router = Router();

router.get('/',controller.getAllZones);
router.post('/create-zone',controller.createZone);
router.get('/:zoneId',controller.getZoneById);



export default router;