import {Router} from "express";
import * as controller from '../controllers/report.controller';
import {upload} from '../middlewares/saveImages.middleware';
import {auth} from "../middlewares/auth.middlewares";

const router = Router();

router.get('/filterBy', controller.getReportsByLatLongRadius);

router.get('/', auth, controller.getAllReports);

router.get('/:id', auth, controller.getReportsById);

router.get('/:userId', auth, controller.getReportByUser);

router.post('/', auth, upload.single("image"), controller.createReport);

export default router;