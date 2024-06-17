import {Router} from "express";
import controller from '../controllers/category.controller';
import { auth } from "../middlewares/auth.middlewares";
import { makeInvoker } from "awilix-express";

const api = makeInvoker(controller);
const categoryRouter = Router();
categoryRouter.get('/', api('getAllCategories'));
categoryRouter.get('/:id',api('getCategoriesById'));
categoryRouter.post('/',auth,api('createCategory'));

export default categoryRouter;