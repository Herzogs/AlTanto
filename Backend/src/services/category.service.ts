import * as CategoryRepository from '../repository/category.repository';
import { ICategory } from '../interfaces/category.interface';
import { CategoryNotCreatedException, CategoryNotFoundException } from '../exceptions/category.exceptions';

async function getAllCategories(): Promise<ICategory[]> {
  const categories = await CategoryRepository.default.getAll();
  if(!categories) throw new CategoryNotFoundException('Categories not found');
  return categories
  
}

async function getCategoriesById(categoryId: number): Promise<ICategory> {
    const categorySearched = await CategoryRepository.default.getByID(categoryId);
    if (!categorySearched) throw new CategoryNotFoundException('Categories not found');
    return categorySearched;
}

async function createCategory(name:string): Promise<ICategory> {
    const newCategory = await CategoryRepository.default.create(name);
    if(!newCategory) throw new CategoryNotCreatedException('Category not created');
    return newCategory;
}

export{
    getAllCategories,
    getCategoriesById,
    createCategory
}