import {Router} from "express";
import * as controller from '../controllers/category.controller';
import { auth } from "../middlewares/auth.middlewares";
const router = Router();

router.get('/',controller.getAllCategories);

router.get('/:id',controller.getCategoriesById);

router.post('/',auth,controller.createCategory);

export default router;