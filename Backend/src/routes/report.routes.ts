import { Router } from "express";
import * as controller from '../controllers/report.controller';

const router = Router();

router.get('/',controller.getAllReports);

router.get('/:reportId',controller.getReportsById);

router.get('/:userId',controller.getReportByUser);

router.post('/', controller.createReport);

router.post('/reportId', controller.updateReport);

router.delete('/:reportId',controller.deleteReport);

export default router;