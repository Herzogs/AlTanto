import {Router} from "express";
import * as controller from '../controllers/category.controller';
import { auth } from "../middlewares/auth.middlewares";
const categoryRouter = Router();

categoryRouter.get('/',controller.getAllCategories);
categoryRouter.get('/:id',controller.getCategoriesById);
categoryRouter.post('/',auth,controller.createCategory);

export default categoryRouter;