import {Router} from "express";
import * as controller from '../controllers/report.controller';
import {upload} from '../middlewares/saveImages.middleware';

const router = Router();



router.get('/filterBy', controller.getReportsByLatLongRadius);

router.get('/', controller.getAllReports);


router.get('/:id', controller.getReportsById);


router.get('/:userId', controller.getReportByUser);

router.post('/', upload.single("image"), controller.createReport);

export default router;