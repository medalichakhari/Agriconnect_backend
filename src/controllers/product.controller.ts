import { Request, Response } from 'express';
import { ProductService } from '../services/product.service';
import { handleError } from '../utils/response';

export const createProduct = async (req: Request, res: Response) => {
  try {
    const { name, description, price, quantity, imageUrl, categoryId } =
      req.body;
    const ownerId = req.user?.userId;

    if (!ownerId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const product = await ProductService.create(
      {
        name,
        description,
        price,
        quantity,
        imageUrl,
        categoryId,
      },
      ownerId
    );

    res.status(201).json({
      message: 'Product created successfully',
      data: product,
    });
  } catch (error) {
    handleError(res, error);
  }
};

export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const result = await ProductService.getAll(req.query);
    res.json({
      message: 'Products retrieved successfully',
      data: result.products,
      meta: {
        page: result.page,
        limit: result.limit,
        total: result.total,
        totalPages: Math.ceil(result.total / result.limit),
      },
    });
  } catch (error) {
    handleError(res, error);
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const product = await ProductService.getById(id);
    res.json({
      message: 'Product retrieved successfully',
      data: product,
    });
  } catch (error) {
    handleError(res, error);
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description, price, quantity, imageUrl, categoryId } =
      req.body;
    const userId = req.user?.userId;
    const userRole = req.user?.role;

    if (!userId || !userRole) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const product = await ProductService.update(
      id,
      {
        name,
        description,
        price,
        quantity,
        imageUrl,
        categoryId,
      },
      userId,
      userRole
    );

    res.json({
      message: 'Product updated successfully',
      data: product,
    });
  } catch (error) {
    handleError(res, error);
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;
    const userRole = req.user?.role;

    if (!userId || !userRole) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    await ProductService.delete(id, userId, userRole);
    res.json({
      message: 'Product deleted successfully',
    });
  } catch (error) {
    handleError(res, error);
  }
};
