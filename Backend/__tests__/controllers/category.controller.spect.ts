import { config } from 'dotenv';
import { Request, Response, NextFunction } from 'express';
import CategoryController from '../../src/controllers/category.controller';
import * as categoryValidator from '../../src/validator/category.validator';
import { IService } from '../../src/services/interfaces/category.service.interface';
import { ICategory } from '../../src/models/category.interface';
import { STATUS_CODE } from '../../src/utilities/statusCode.utilities';

jest.mock('../../src/services/category.service', () => {
    return jest.fn().mockImplementation(() => ({
        getAll: jest.fn(),
        getByID: jest.fn(),
        create: jest.fn(),
    }));
});

jest.mock('../../src/validator/category.validator', () => {
    return {
        getCategoriesByIdValidator: {
            safeParseAsync: jest.fn(),
        },
        createCategoryValidator: {
            safeParseAsync: jest.fn(),
        },
    };
});

describe('Category Controller', () => {
    let categoryService: jest.Mocked<IService<ICategory>>;
    let categoryController: CategoryController;

    beforeAll(() => {
        config();
    });

    beforeEach(() => {
        categoryService = {
            getAll: jest.fn(),
            getByID: jest.fn(),
            create: jest.fn(),
        } as jest.Mocked<IService<ICategory>>;

        categoryController = new CategoryController({ categoryService });
    });

    test('should get all categories successfully', async () => {
        const categories = [{ id: 1, name: 'Category 1' }];
        categoryService.getAll.mockResolvedValue(categories);

        const req = {} as Request;
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;
        const next = jest.fn() as NextFunction;

        await categoryController.getAllCategories(req, res, next);

        expect(res.status).toHaveBeenCalledWith(STATUS_CODE.SUCCESS);
        expect(res.json).toHaveBeenCalledWith(categories);
        expect(next).not.toHaveBeenCalled();
    });

    test('should handle error when getting all categories', async () => {
        const error = new Error('Failed to get categories');
        categoryService.getAll.mockRejectedValue(error);

        const req = {} as Request;
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;
        const next = jest.fn() as NextFunction;

        await categoryController.getAllCategories(req, res, next);

        expect(next).toHaveBeenCalledWith({ message: error.message, statusCode: STATUS_CODE.BAD_REQUEST });
    });

    test('should get a category by id successfully', async () => {
        const validDataResult = { success: true, data: { id: '1' } };
        const category = { id: 1, name: 'Category 1' };

        (categoryValidator.getCategoriesByIdValidator.safeParseAsync as jest.Mock).mockResolvedValue(validDataResult);
        categoryService.getByID.mockResolvedValue(category);

        const req = { params: { id: '1' } } as unknown as Request;
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;
        const next = jest.fn() as NextFunction;

        await categoryController.getCategoriesById(req, res, next);

        expect(res.json).toHaveBeenCalledWith(category);
        expect(next).not.toHaveBeenCalled();
    });

    test('should return validation error when getting category by id', async () => {
        const invalidDataResult = {
            success: false,
            error: {
                errors: [
                    { message: 'Invalid id', path: ['id'] }
                ]
            }
        };

        (categoryValidator.getCategoriesByIdValidator.safeParseAsync as jest.Mock).mockResolvedValue(invalidDataResult);

        const req = { params: { id: '1' } } as unknown as Request;
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;
        const next = jest.fn() as NextFunction;

        await categoryController.getCategoriesById(req, res, next);

        expect(next).toHaveBeenCalledWith({ message: 'Invalid id', statusCode: STATUS_CODE.INVALID_TOKEN });
    });

    // Tests for createCategory
    test('should create a category successfully', async () => {
        const validDataResult = { success: true, data: { name: 'New Category' } };
        const newCategory = { id: 1, name: 'New Category' };

        (categoryValidator.createCategoryValidator.safeParseAsync as jest.Mock).mockResolvedValue(validDataResult);
        categoryService.create.mockResolvedValue(newCategory);

        const req = { body: { name: 'New Category' } } as Request;
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;
        const next = jest.fn() as NextFunction;

        await categoryController.createCategory(req, res, next);

        expect(res.json).toHaveBeenCalledWith(newCategory);
        expect(next).not.toHaveBeenCalled();
    });

    test('should return validation error when creating a category with invalid data', async () => {
        const invalidDataResult = {
            success: false,
            error: {
                errors: [
                    { message: 'Invalid name', path: ['name'] }
                ]
            }
        };

        (categoryValidator.createCategoryValidator.safeParseAsync as jest.Mock).mockResolvedValue(invalidDataResult);

        const req = { body: {} } as Request;
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;
        const next = jest.fn() as NextFunction;

        await categoryController.createCategory(req, res, next);

        expect(next).toHaveBeenCalledWith({ message: 'Invalid name', statusCode: STATUS_CODE.INVALID_TOKEN });
    });

    test('should handle error when creating a category', async () => {
        const validDataResult = { success: true, data: { name: 'New Category' } };
        const error = new Error('Failed to create category');

        (categoryValidator.createCategoryValidator.safeParseAsync as jest.Mock).mockResolvedValue(validDataResult);
        categoryService.create.mockRejectedValue(error);

        const req = { body: { name: 'New Category' } } as Request;
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;
        const next = jest.fn() as NextFunction;

        await categoryController.createCategory(req, res, next);

        expect(next).toHaveBeenCalledWith({ message: error.message, statusCode: STATUS_CODE.BAD_REQUEST });
    });
});
