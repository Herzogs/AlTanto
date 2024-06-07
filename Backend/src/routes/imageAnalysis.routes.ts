import Router from 'express';
import multer from 'multer';
import analyzeImage from '../controllers/imageAnalysis.controller';
const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/', upload.single('image'), analyzeImage);

export default router;
