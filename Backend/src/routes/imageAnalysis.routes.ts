import Router from 'express';
import multer from 'multer';
import analyzeImage from '../controllers/imageAnalysis.controller';
const upload = multer({ storage: multer.memoryStorage() });
const imageRouter = Router();

imageRouter.post('/', upload.single('image'), analyzeImage);

export default imageRouter;
