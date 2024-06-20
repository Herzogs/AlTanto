import { ICategory } from '../models/category.interface';
import { CategoryNotCreatedException, CategoryNotFoundException } from '../exceptions/category.exceptions';
import { IService } from './interfaces/category.service.interface';
import { IRepository } from '../repository/interface/category.repository.interface';

class CategoryService implements IService<ICategory> {
    private categoryRepository: IRepository<ICategory>;

    constructor({ categoryRepository }: { categoryRepository: IRepository<ICategory> }) {
        this.categoryRepository = categoryRepository;
    }
    
    async getAll(): Promise<ICategory[]> {
        const categories = await this.categoryRepository.getAll();
        if (!categories || categories.length === 0) {
            throw new CategoryNotFoundException('Categories not found');
        }
        return categories;
    }

    async getByID(categoryId: number): Promise<ICategory> {
        const categorySearched = await this.categoryRepository.getByID(categoryId);
        if (!categorySearched) {
            throw new CategoryNotFoundException(`Category with ID ${categoryId} not found`);
        }
        return categorySearched;
    }

    async create(name: string): Promise<ICategory> {
        const newCategory = await this.categoryRepository.create(name);
        if (!newCategory) {
            throw new CategoryNotCreatedException('Category not created');
        }
        return newCategory;
    }
}

export default CategoryService;
