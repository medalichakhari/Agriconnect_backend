import { Request, Response } from 'express';
import { CategoryService } from '../services/category.service';
import { handleError } from '../utils/response';

export const createCategory = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    const category = await CategoryService.create({ name });
    res.status(201).json({
      message: 'Category created successfully',
      data: category,
    });
  } catch (err) {
    handleError(res, err);
  }
};

export const getCategories = async (req: Request, res: Response) => {
  try {
    const result = await CategoryService.getAll(req.query);
    res.json({
      message: 'Categories retrieved successfully',
      data: result.categories,
      meta: {
        page: result.page,
        limit: result.limit,
        total: result.total,
        totalPages: Math.ceil(result.total / result.limit),
      },
    });
  } catch (err) {
    handleError(res, err);
  }
};

export const getCategoryById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const category = await CategoryService.getById(id);
    res.json({
      message: 'Category retrieved successfully',
      data: category,
    });
  } catch (err) {
    handleError(res, err);
  }
};

export const updateCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const category = await CategoryService.update(id, { name });
    res.json({
      message: 'Category updated successfully',
      data: category,
    });
  } catch (err) {
    handleError(res, err);
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await CategoryService.delete(id);
    res.json({
      message: 'Category deleted successfully',
    });
  } catch (err) {
    handleError(res, err);
  }
};
