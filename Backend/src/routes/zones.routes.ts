import {Router} from "express";
import * as controller from '../controllers/zone.controller';
import validateData from "../middlewares/validateData.middleware";
import {createZoneValidator} from "../validator/zone.validator";
import {auth} from "../middlewares/auth.middlewares";

const router = Router();

router.get('/', auth, controller.getAllZones);
router.post('/',auth, validateData(createZoneValidator), controller.createZone);
router.get('/:id',auth, controller.getZoneById);


export default router;