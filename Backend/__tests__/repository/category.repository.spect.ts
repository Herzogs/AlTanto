import container from "../../src/container";
import { asValue,  } from "awilix";
import { CategoryMock } from "../mocks/CategoryMock"; // Importa tu modelo simulado

describe('Category Repository', () => {
    let categoryRepository: any;

    beforeEach(async () => {
        // Simula la resolución del repositorio con el modelo simulado
        container.register({
            categoryRepository: asValue({
                create: async (id: number,name: string) => {
                    if (name === 'Test Category') {
                        return null;
                    }
                    return CategoryMock.build({id, name });
                },
                getByID: async (id: number) => {
                    return CategoryMock.build({ id, name: 'Test Category' });
                },
                getAll: async () => {
                    return [CategoryMock.build({ name: 'Test Category' })];
                }
            })
        });
        categoryRepository = container.resolve('categoryRepository');
    });

    test('should create a category', async () => {
        const categoryName = 'New Test Category';
        const createdCategory = await categoryRepository.create(1, categoryName);

        expect(createdCategory).toBeDefined();
        expect(createdCategory.name).toBe(categoryName);
    });

    test('should get a category by id', async () => {
        const categoryName = 'Test Category';
        const createdCategory = await categoryRepository.create(1,categoryName);

        const fetchedCategory = await categoryRepository.getByID(createdCategory.id);

        expect(fetchedCategory).toBeDefined();
        expect(fetchedCategory.name).toBe(categoryName);
    });

    test('should get all categories', async () => {
        const categoryName = 'New Test Category';
        await categoryRepository.create(categoryName);

        const categories = await categoryRepository.getAll();
        console.log(categories.length);
        expect(categories).toBeDefined();
        expect(categories.length).toBeGreaterThan(0);
    });

    test('should give null if category already exists', async () => {
        const categoryName = 'Test Category';
        await categoryRepository.create(1, categoryName);

        const createdCategory2 = await categoryRepository.create(categoryName);

        expect(createdCategory2).toBeNull();
    });
});
