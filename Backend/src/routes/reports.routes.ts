import {Router} from "express";
import controller from '../controllers/report.controller';
//import { auth } from "../middlewares/auth.middlewares";
import { makeInvoker } from "awilix-express";


const reportRouter = Router();
const api = makeInvoker(controller);

reportRouter.get('/', api('getAllReports'));
reportRouter.get('/:id', api('getReportById'));
//reportRouter.get('/user/:userId', api('getReportByUser'));
reportRouter.post('/', api('createReport'));
reportRouter.get('/group/:groupId', api('getReportsByGroup'));

export default reportRouter;