import * as categoriesServices from '../../src/services/category.service';
import CategoriesRepository from '../../src/repository/category.repository';
import { ICategory } from '../../src/interfaces/category.interface';

jest.mock('../../src/repository/category.repository', () => ({
    getAll: jest.fn()
}));


describe('Category Services', () => {
    it('should return all categories', async () => {
        const mockedCategories: ICategory[] = [
            {
                id: 1,
                name: 'Category 1'
            },
            {
                id: 2,
                name: 'Category 2'
            }
        ];

        CategoriesRepository.getAll = jest.fn().mockResolvedValue(mockedCategories);
        const categories = await categoriesServices.getAllCategories();
        expect(categories).toEqual(mockedCategories);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });
});