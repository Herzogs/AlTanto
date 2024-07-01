import {IRepository} from './interface/category.repository.interface';
import {ICategory} from '../models/category.interface';
import Category from './entities/Category';
import {ModelCtor} from 'sequelize';

class CategoryRepository implements IRepository<ICategory> {
    private categoryModel: ModelCtor<Category>;

    constructor({Category}: { Category: ModelCtor<Category> }) {
        this.categoryModel = Category;
    }

    async getAll(): Promise<ICategory[]> {
        const categories = await this.categoryModel.findAll();
        if (!categories) return [];
        return categories.map((category) => category.get({plain: true}));
    }

    async getByID(categoryId: number): Promise<ICategory | null> {
        const categorySearched = await this.categoryModel.findByPk(categoryId);
        if (!categorySearched) return null;
        return categorySearched.get({plain: true});
    }

    async getByName(name: string): Promise<ICategory | null> {
        const categorySearched = await this.categoryModel.findOne({where: {name}});
        if (!categorySearched) return null;
        return categorySearched.get({plain: true});
    }

    async create(name: string): Promise<ICategory | null> {
        try {
            // Verificar si la categoría ya existe
            const existingCategory = await this.categoryModel.findOne({where: {name}});
            if (existingCategory) {
                console.log(`Category '${name}' already exists. repository 36`);
          console

                return null; // Devolver null si la categoría ya existe
            }

            // Si la categoría no existe, crearla
            const newCategory = await this.categoryModel.create({name});
            return newCategory.get({plain: true}) as ICategory;
        } catch (error) {
            console.error('Error creating category:', error);
            return null;
        }
    }
}


export default CategoryRepository;
