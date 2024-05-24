import { Router } from "express";
import * as controller from '../controllers/category.controller';

const router = Router();

router.get('/',controller.getAllCategories);

router.get('/:id',controller.getCategoriesById);

router.post('/',controller.createCategory);

export default router;