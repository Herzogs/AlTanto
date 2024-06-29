import { NextFunction, Request, Response } from 'express';
import * as categoryValidator from '../validator/category.validator'
import { ICategory } from '../models/category.interface';
import { IService } from '../services/interfaces/category.service.interface';
import { STATUS_CODE } from '../utilities/statusCode.utilities';

class CategoryController {
    private service: IService<ICategory>;

    constructor({ categoryService }: { categoryService: IService<ICategory> }) {
        this.service = categoryService;
    }

    async getAllCategories(_req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            const categories = await this.service.getAll();
            return res.status(STATUS_CODE.SUCCESS).json(categories);
        } catch (error) {
            return next({ message: (error as Error).message, statusCode: STATUS_CODE.BAD_REQUEST });
        }
    }

    async getCategoriesById(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        const validationResult = await categoryValidator.getCategoriesByIdValidator.safeParseAsync(req.params);
        if (!validationResult.success) {
            return next({ message: validationResult.error.errors[0].message, statusCode: STATUS_CODE.INVALID_TOKEN });
        }
        try {
            const { id } = validationResult.data as { id: string };
            const category = await this.service.getByID(+id);
            if (category) {
                return res.json(category);
            }
        } catch (error) {
            return next({ message: (error as Error).message, statusCode: STATUS_CODE.BAD_REQUEST });
        }
    }

    async createCategory(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        const validationResult = await categoryValidator.createCategoryValidator.safeParseAsync(req.body);
        if (!validationResult.success) {
            return next({ message: validationResult.error.errors[0].message, statusCode: STATUS_CODE.INVALID_TOKEN });
        }
        const { name } = validationResult.data as { name: string };
        try {
            const newCategory = await this.service.create(name);
            return res.json(newCategory);
        } catch (error) {
            return next({ message: (error as Error).message, statusCode: STATUS_CODE.BAD_REQUEST });
        }
    }
}

export default CategoryController