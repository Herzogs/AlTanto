import CategoryRepository from "../../src/repository/category.repository";
import container from "../../src/container";
import { config } from "dotenv";
import { Lifetime } from "awilix";
import dbConnection from "../../src/config/dbConnection.config";

describe('Category Repository', () => {
    let categoryRepository: CategoryRepository;

    beforeAll(() => {
        config();
        container.loadModules([
            ['../../src/models/*.model.ts', Lifetime.SCOPED],
            ['../../src/repository/*.repository.ts', Lifetime.SCOPED],
        ]);
    });

    beforeEach(async () => {
        await dbConnection.sync({ force: true }); 
        categoryRepository = container.resolve<CategoryRepository>('categoryRepository');
    });

    test('should create a category', async () => {
        const categoryName = 'Test Category';
        const createdCategory = await categoryRepository.create(categoryName);

        expect(createdCategory).toBeDefined();
        expect(createdCategory!.name).toBe(categoryName);
    });

    test('should get a category by id', async () => {
        const categoryName = 'Another Test Category';
        const createdCategory = await categoryRepository.create(categoryName);

        const fetchedCategory = await categoryRepository.getByID(createdCategory!.id as number);

        expect(fetchedCategory).toBeDefined();
        expect(fetchedCategory!.name).toBe(categoryName);
    });

    test('should get all categories', async () => {
        const categoryName = 'Test Category';
        await categoryRepository.create(categoryName);

        const categories = await categoryRepository.getAll();

        expect(categories).toBeDefined();
        expect(categories.length).toBeGreaterThan(0);
    });

    test('should give null if category already exists', async () => {
        const categoryName = 'Test Category';
        await categoryRepository.create(categoryName);

        const createdCategory2 = await categoryRepository.create(categoryName);

        expect(createdCategory2).toBeNull();
    });
});
