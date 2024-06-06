import {Router} from "express";
import * as controller from '../controllers/report.controller';
import {upload} from '../middlewares/saveImages.middleware';
import {auth} from "../middlewares/auth.middlewares";
import validateData from "../middlewares/validateData.middleware";
import {createReportValidator} from "../validator/report.validator";

const router = Router();

router.get('/filterBy', controller.getReportsByLatLongRadius);

router.get('/', controller.getAllReports);


router.get('/:id', controller.getReportsById);


router.get('/:userId', controller.getReportByUser);

router.post('/', auth, validateData(createReportValidator), upload.single("image"), controller.createReport);

export default router;