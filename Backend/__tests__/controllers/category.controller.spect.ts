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

    test('should get a category by id', async () => {
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

    test('should return bad request error when creating a category with invalid data', async () => {
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
    
});
