import { Router } from "express";
import controller from '../controllers/report.controller';
import { auth } from "../middlewares/auth.middlewares";
import { makeInvoker } from "awilix-express";
import { upload } from "../middlewares/saveImages.middleware";

const reportRouter = Router();
const api = makeInvoker(controller);

reportRouter.get('/', api('getAllReports'));
reportRouter.get('/:id', api('getReportById'));
//reportRouter.get('/user/:userId', api('getReportByUser'));
reportRouter.post('/', auth, upload.single('image'), api('createReport'));
reportRouter.get('/group/:groupId', auth, api('getReportsByGroup'));
reportRouter.post('/scoring', auth, api('scoringReport'))

export default reportRouter;