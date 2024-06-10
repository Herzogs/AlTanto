import  { ICategory }  from '../interfaces/category.interface';
import Category from '../models/Category';

class CategoryRepository {

    static async getAll(): Promise<ICategory[]> {
        const categories = await Category.findAll();
        if (!categories) return [];
        return categories.map((category) => category.get({ plain: true })) as ICategory[];
    }

    static async getByID(categoryId: number): Promise<ICategory | null> {
        const categorySearched = await Category.findByPk(categoryId);
        if (!categorySearched) return null;
        return categorySearched.get({ plain: true }) as ICategory;
    }

    static async getByName(name: string): Promise<ICategory | null> {
        const categorySearched = await Category.findOne({ where: { name } });
        if (!categorySearched) return null;
        return categorySearched.get({ plain: true }) as ICategory;
    }

    static async create(name: string): Promise<ICategory | null> {
        const category = await Category.findOne({ where: { name } });
        if (category) return null;
        const newCategory = await Category.create({ name });
        return newCategory.get({ plain: true }) as ICategory;
    }
}

export default CategoryRepository;