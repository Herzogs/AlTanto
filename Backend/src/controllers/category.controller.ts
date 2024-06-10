import { NextFunction, Request, Response } from 'express';
import * as categoryService from '../services/category.service';
import * as categoryValidator from '../validator/category.validator'
import { CategoryNotCreatedException, CategoryNotFoundException } from '../exceptions/category.exceptions';

const getAllCategories = async (_req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
        const categories = await categoryService.getAllCategories();
        return res.json(categories);
    } catch (error) {
        if (error instanceof CategoryNotFoundException) {
            return next({ message: error.message, statusCode: error.statusCode });
        }
        // Para otros tipos de errores, pasar al siguiente middleware de error
        return next((error as Error).message);
    }
};

const getCategoriesById = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const validationResult = await categoryValidator.getCategoriesByIdValidator.safeParseAsync(req.params);
    if (!validationResult.success) {
        return next({ message: validationResult.error.errors[0].message, statusCode: 400 });
    }
    try {
        const { id } = validationResult.data as { id: string };
        const category = await categoryService.getCategoriesById(+id);
        if (category) {
            return res.json(category);
        } 
    } catch (error) {
        if (error instanceof CategoryNotFoundException) {
            return next({ message: error.message, statusCode: error.statusCode });
        }
        return next((error as Error).message);
    }
};

const createCategory = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const validationResult = await categoryValidator.createCategoryValidator.safeParseAsync(req.body);
    if (!validationResult.success) {
        return next({ message: validationResult.error.errors[0].message, statusCode: 400 });
    }
    const { name } = validationResult.data as { name: string };
    try {
        const newCategory = await categoryService.createCategory(name);
        return res.json(newCategory);
    } catch (error) {
        if (error instanceof CategoryNotCreatedException) {
            return next({ message: error.message, statusCode: error.statusCode });
        }
        return next((error as Error).message);
    }
};

export {
    getAllCategories,
    getCategoriesById,
    createCategory,
}