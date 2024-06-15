import { NextFunction, Request, Response } from 'express';
import CategoryService from '../services/category.service';
import * as categoryValidator from '../validator/category.validator'
import { CategoryNotCreatedException, CategoryNotFoundException } from '../exceptions/category.exceptions';
import { ICategory } from '../interfaces/category.interface';
import { IService } from '../services/interfaces/category.service.interface';
class CategoryController {
    private service: IService<ICategory>;

    constructor(service = CategoryService) {
        this.service = service;
    }

    async getAllCategories(_req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            const categories = await this.service.getAll();
            return res.json(categories);
        } catch (error) {
            if (error instanceof CategoryNotFoundException) {
                return next({ message: error.message, statusCode: 400  });
            }
            // Para otros tipos de errores, pasar al siguiente middleware de error
            return next((error as Error).message);
        }
    }
    
    async getCategoriesById (req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        const validationResult = await categoryValidator.getCategoriesByIdValidator.safeParseAsync(req.params);
        if (!validationResult.success) {
            return next({ message: validationResult.error.errors[0].message, statusCode: 400 });
        }
        try {
            const { id } = validationResult.data as { id: string };
            const category = await this.service.getByID(+id);
            if (category) {
                return res.json(category);
            }
        } catch (error) {
            if (error instanceof CategoryNotFoundException) {
                return next({ message: error.message, statusCode: 400 });
            }
            return next((error as Error).message);
        }
    }

    async createCategory (req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        const validationResult = await categoryValidator.createCategoryValidator.safeParseAsync(req.body);
        if (!validationResult.success) {
            return next({ message: validationResult.error.errors[0].message, statusCode: 400 });
        }
        const { name } = validationResult.data as { name: string };
        try {
            const newCategory = await this.service.create(name);
            return res.json(newCategory);
        } catch (error) {
            if (error instanceof CategoryNotCreatedException) {
                return next({ message: error.message, statusCode: 400 });
            }
            return next((error as Error).message);
        }
    }
}

export default new CategoryController()