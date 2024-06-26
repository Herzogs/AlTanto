import Router from 'express';
import multer from 'multer';
import analyzeImage from '../controllers/imageAnalysis.controller';

import { makeInvoker } from 'awilix-express';
import { auth } from '../middlewares/auth.middlewares';


const imageRouter = Router();
const api = makeInvoker(analyzeImage);
const upload = multer({ storage: multer.memoryStorage() });

imageRouter.post('/', auth, upload.single('image'), api('analyzeImage'));

export default imageRouter;
