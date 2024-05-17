import { Request, Response } from 'express';
import * as categoryService from '../services/category.service';


const getAllCategories = async (_req: Request, res: Response): Promise<Response> => {
    try {
        const categories = await categoryService.getAllCategories();
        return res.json(categories);
    } catch (error) {
        return res.status(500).json({ error: (error as Error).message });
    }
};

const getCategoriesById = async (req: Request, res: Response): Promise<Response> => {
    try {
        const categoryId = parseInt(req.params.categoryId);
        const category = await categoryService.getCategoriesById(categoryId);
        if (category) {
            return res.json(category);
        } else {
            return res.status(404).json({ error: 'Report not found' });
        }
    } catch (error) {
        return res.status(500).json({ error: (error as Error).message });
    }
};

const createCategory = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { name } = req.body;
        console.log(req.body.name);
        const newCategory = await categoryService.createCategory(name);
        return res.json(newCategory);
    } catch (error) {
        return res.status(500).json({ error: (error as Error).message });
    }
};

const updateCategory = async (req: Request, res: Response): Promise<Response> => {
    try {
        const categoryId = parseInt(req.params.categoryId);
        const updatedData = req.body;

        const [rowsUpdated, updatedCategories] = await categoryService.updateCategory(categoryId, updatedData);

        if (rowsUpdated === 0) {
            return res.status(404).json({ error: 'Report not found' });
        }

        return res.json(updatedCategories[0]);
    } catch (error) {
        return res.status(500).json({ error: (error as Error).message });
    }
};

const deleteCategory = async (req: Request, res: Response): Promise<Response> => {
    try {
        const categoryId = parseInt(req.params.categoryId);
        const rowsDeleted = await categoryService.deleteCategory(categoryId);

        if (rowsDeleted === 0) {
            return res.status(404).json({ error: 'Report not found' });
        }

        return res.status(204).send();
    } catch (error) {
        return res.status(500).json({ error: (error as Error).message });
    }
};


export{
    getAllCategories,
    getCategoriesById,
    createCategory,
    updateCategory,
    deleteCategory
}