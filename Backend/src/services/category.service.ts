import Category from '../models/Category';

async function getAllCategories(): Promise<Category[]> {
  return await Category.findAll();
}

async function getCategoriesById(categoryId: number): Promise<Category | null> {
    return await Category.findByPk(categoryId);
}

async function createCategory(name:string): Promise<Category> {
    const newCategory = await Category.create({name});
    return newCategory;
}

async function updateCategory(categoryId: number, updatedData: any): Promise<[number, Category[]]> {
    const [rowsUpdated, updatedReports] = await Category.update(updatedData, {
      where: { id: categoryId },
      returning: true
    });
    return [rowsUpdated, updatedReports];
}

async function deleteCategory(categoryId: number): Promise<number> {
    const rowsDeleted = await Category.destroy({
      where: { id: categoryId }
    });
    return rowsDeleted;
}

export{
    getAllCategories,
    getCategoriesById,
    createCategory,
    updateCategory,
    deleteCategory
}