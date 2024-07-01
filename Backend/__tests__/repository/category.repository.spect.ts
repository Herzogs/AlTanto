import CategoryRepository from '../../src/repository/category.repository';
import { CategoryMock} from '../mocks/CategoryMock';

describe('CategoryRepository', () => {
    let categoryRepository: CategoryRepository;

    beforeAll(() => {
        categoryRepository = new CategoryRepository({Category: CategoryMock});
    });

    it('should create a new category', async () => {
        const newCategory = await categoryRepository.create('Alerta');
        const segundo = await categoryRepository.create('Transito');
        expect(newCategory).toBeDefined();
        expect(segundo).toBeDefined();
        expect(newCategory?.name).toBe('Alerta');
        expect(segundo?.name).toBe('Transito');
    });
    it('should null', async () => {
        const newCategory = await categoryRepository.create('Seguridad');

        expect(newCategory).toBeDefined();

        expect(newCategory).toBeNull();

    });



    it('should get all categories', async () => {
        const allCategories = await categoryRepository.getAll()
        expect(allCategories).toBeDefined();
        expect(allCategories.length).toBeGreaterThan(1);

    });

    it('should get category by ID', async () => {
        const category = await categoryRepository.getByID(1);
        console.log(category, "que sera que tiene ")
        expect(category).toBeDefined();
        expect(category?.id).toBe(1);
    });

    it('should get category by name', async () => {
        const category1 = await categoryRepository.getByName('Seguridad');
        expect(category1).toBeDefined();
        expect(category1?.name).toBe('Seguridad');

    });

});
