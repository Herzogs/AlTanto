import {Router} from "express";
import * as controller from '../controllers/report.controller';
import {upload} from '../middlewares/saveImages.middleware';
import { auth } from "../middlewares/auth.middlewares";

const reportRouter = Router();

reportRouter.get('/filterBy', controller.getReportsByLatLongRadius);
reportRouter.get('/', auth, controller.getAllReports);
reportRouter.get('/:id', auth, controller.getReportsById);
reportRouter.get('/:userId', auth, controller.getReportByUser);
reportRouter.post('/', auth, upload.single("image"), controller.createReport);
reportRouter.get('/group/:groupId', auth, controller.getReportsByGroup);

export default reportRouter;