import {Router} from "express";
import * as controller from '../controllers/zone.controller';
import { auth } from "../middlewares/auth.middlewares";

const zoneRouter = Router();

zoneRouter.get('/', auth, controller.getAllZones);
zoneRouter.post('/', auth, controller.createZone);
zoneRouter.get('/:id', auth, controller.getZoneById);
zoneRouter.post('/notification/', auth, controller.reportsByZone);
zoneRouter.get('/user/:id', auth, controller.getAllZonesByUserId);


export default zoneRouter;