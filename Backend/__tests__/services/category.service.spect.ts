import { CategoryNotCreatedException, CategoryNotFoundException } from '../../src/exceptions/category.exceptions';
import CategoryService from '../../src/services/category.service';
import { IRepository } from '../../src/repository/interface/category.repository.interface';
import { ICategory } from '../../src/models/category.interface';

jest.mock('../../src/repository/interface/category.repository.interface', () => {
    return jest.fn().mockImplementation(() => {
        return {
            create: jest.fn(),
            getByID: jest.fn(),
            getAll: jest.fn(),
        };
    });
});

describe('Category Service', () => {
    let categoryService: CategoryService;
    let categoryRepository: jest.Mocked<IRepository<ICategory>>;

    beforeEach(() => {
        categoryRepository = {
            create: jest.fn(),
            getByID: jest.fn(),
            getAll: jest.fn(),
        } as unknown as jest.Mocked<IRepository<ICategory>>;

        categoryService = new CategoryService({ categoryRepository });
    });

    test('should create a category', async () => {
        const categoryData: ICategory = {
            id: 1,
            name: 'Test Category',
        };

        categoryRepository.create.mockResolvedValue(categoryData);

        const createdCategory = await categoryService.create('Test Category');

        expect(createdCategory).toBeDefined();
        expect(createdCategory.name).toBe(categoryData.name);
    });

    test('should throw CategoryNotCreatedException when category could not be created', async () => {
        categoryRepository.create.mockResolvedValue(null);

        await expect(categoryService.create('Test Category')).rejects.toThrow(CategoryNotCreatedException);
    });

    test('should get category by id', async () => {
        const categoryData: ICategory = {
            id: 1,
            name: 'Test Category',
        };

        categoryRepository.getByID.mockResolvedValue(categoryData);

        const category = await categoryService.getByID(1);

        expect(category).toBeDefined();
        expect(category.name).toBe(categoryData.name);
    });

    test('should throw CategoryNotFoundException when category not found by id', async () => {
        categoryRepository.getByID.mockResolvedValue(null);

        await expect(categoryService.getByID(1)).rejects.toThrow(CategoryNotFoundException);
    });

    test('should get all categories', async () => {
        const categoriesData: ICategory[] = [
            { id: 1, name: 'Category 1' },
            { id: 2, name: 'Category 2' },
        ];

        categoryRepository.getAll.mockResolvedValue(categoriesData);

        const categories = await categoryService.getAll();

        expect(categories).toHaveLength(categoriesData.length);
        expect(categories[0].name).toBe(categoriesData[0].name);
        expect(categories[1].name).toBe(categoriesData[1].name);
    });

    test('should throw CategoryNotFoundException when no categories found', async () => {
        categoryRepository.getAll.mockResolvedValue([]);

        await expect(categoryService.getAll()).rejects.toThrow(CategoryNotFoundException);
    });
});
