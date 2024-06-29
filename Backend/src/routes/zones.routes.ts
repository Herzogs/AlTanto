import {Router} from "express";
import controller from '../controllers/zone.controller';
import { auth } from "../middlewares/auth.middlewares";
import { makeInvoker } from "awilix-express";

const zoneRouter = Router();
const api = makeInvoker(controller);

zoneRouter.get('/filterBy', api('getFilteredReports'));
zoneRouter.get('/',auth, api('getAll'));
zoneRouter.post('/',auth, api('create'));
zoneRouter.get('/:id',auth, api('getById'));
zoneRouter.get('/notification/:userId',auth, api('getNotification'));
zoneRouter.get('/user/:id',auth, api('getAllByUserId'));


export default zoneRouter;