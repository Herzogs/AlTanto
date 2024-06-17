import { ICategory } from '../interfaces/category.interface';
import { CategoryNotCreatedException, CategoryNotFoundException } from '../exceptions/category.exceptions';
import { IService } from './interfaces/category.service.interface';
import { IRepository } from '../repository/interface/category.repository.interface';

class CategoryService implements IService<ICategory>{

    private categoryRepository: IRepository<ICategory>;

    constructor({ categoryRepository }: { categoryRepository: IRepository<ICategory> }) {
        this.categoryRepository = categoryRepository;
    }
    
    async getAll(): Promise<ICategory[]> {
        const categories = await this.categoryRepository.getAll();
        if(!categories) throw new CategoryNotFoundException('Categories not found');
        return categories as ICategory[];
    }
    async getByID(categoryId: number): Promise<ICategory> {
        const categorySearched = await this.categoryRepository.getByID(categoryId);
        if (categorySearched == null) throw new CategoryNotFoundException('Categories not found');
        return categorySearched;
    }
    async create(name:string): Promise<ICategory> {
        const newCategory = await this.categoryRepository.create(name);
        if(!newCategory) throw new CategoryNotCreatedException('Category not created');
        return newCategory;
    }
}

export default CategoryService;