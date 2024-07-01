import CategoryRepository from '../../src/repository/category.repository';
import {CategoryModel} from '../../src/mocks/CategoryMock';
import category from "../../src/repository/entities/Category"; // Importa las categorías simuladas

describe('CategoryRepository', () => {
    let categoryRepository: CategoryRepository;

    beforeAll(() => {
        categoryRepository = new CategoryRepository({Category: CategoryModel});
    });

    it('should create a new category', async () => {
        const newCategory = await categoryRepository.create('Nueva Categoría de test');
        expect(newCategory).toBeDefined();
        expect(newCategory?.name).toBe('Nueva Categoría de test'); // Ajustar el nombre correctamente
    });



    it('should get all categories', async () => {
        await categoryRepository.create('Nueva Categoría de test');
        await categoryRepository.create('Transito');
        await categoryRepository.create('Transito');
        await categoryRepository.create('Transito');
        await categoryRepository.create('Transito');
        await categoryRepository.create('Alerta');
        await categoryRepository.create('Alerta');

        const allCategories = await categoryRepository.getAll()

        expect(allCategories).toBeDefined();
        expect(allCategories.length).toBeGreaterThan(1); // Asumiendo que hay más de una categoría preexistente

        for (const category of allCategories) {
            console.log(`Category ID: ${category.id}, Name: ${category.name}`);
        }
    });

    it('should get category by ID', async () => {
        await categoryRepository.create('Nueva Categoría de test');
        await categoryRepository.create('Nueva Categoría de test');
        const category = await categoryRepository.getByID(2); // Ajustar según tu configuración de base de datos mockeada
        console.log(category, "que sera que tiene ")
        expect(category).toBeDefined();
        expect(category?.id).toBe(2);
    });

    it('should get category by name', async () => {
        const category1 = await categoryRepository.getByName('Seguridad');
        const category2 = await categoryRepository.getByName('Transito');
        expect(category1).toBeDefined();
        expect(category1?.name).toBe('Seguridad');
        expect(category2).toBeDefined();
        expect(category2?.name).toBe('Transito');
    });

    // Otras pruebas según sea necesario
});
