import {Router} from "express";
import controller from '../controllers/zone.controller';
//import { auth } from "../middlewares/auth.middlewares";
import { makeInvoker } from "awilix-express";

const zoneRouter = Router();
const api = makeInvoker(controller);

zoneRouter.get('/filterBy', api('getFilteredReports'));
zoneRouter.get('/', api('getAll'));
zoneRouter.post('/', api('create'));
zoneRouter.get('/:id', api('getById'));
zoneRouter.get('/notification/:userId', api('getNotification'));
zoneRouter.get('/user/:id', api('getAllByUserId'));


export default zoneRouter;