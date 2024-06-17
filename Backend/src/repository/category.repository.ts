import { IRepository } from './interface/category.repository.interface';
import { ICategory } from '../interfaces/category.interface';
import Category from './models/Category';
import { ModelCtor } from 'sequelize';

class CategoryRepository implements IRepository<ICategory>{

    private categoryModel: ModelCtor<Category>;

    constructor({ Category }: { Category: ModelCtor<Category> }) {
        this.categoryModel = Category;
    }

    async getAll(): Promise<ICategory[]> {
        const categories = await this.categoryModel.findAll();
        if (!categories) return [];
        return categories.map((category) => category.get({ plain: true }));
    }

    async getByID(categoryId: number): Promise<ICategory | null> {
        const categorySearched = await this.categoryModel.findByPk(categoryId);
        if (!categorySearched) return null;
        return categorySearched.get({ plain: true });
    }

    async getByName(name: string): Promise<ICategory | null> {
        const categorySearched = await this.categoryModel.findOne({ where: { name } });
        if (!categorySearched) return null;
        return categorySearched.get({ plain: true });
    }

    async create(name: string): Promise<ICategory | null> {
        const category = await this.categoryModel.findOne({ where: { name } });
        if (category) return null;
        const newCategory = await this.categoryModel.create({ name });
        return newCategory.get({ plain: true });
    }
}

export default CategoryRepository;