import { Router } from "express";
import * as controller from '../controllers/category.controller';

const router = Router();

router.get('/',controller.getAllCategories);

router.get('/:categoryId',controller.getCategoriesById);

router.post('/',controller.createCategory);

router.patch('/:categoryId',controller.updateCategory);

router.delete('/:categoryId',controller.deleteCategory)

export default router;