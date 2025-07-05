import { Request, Response, NextFunction } from 'express';
import { prisma } from '../database';
import { ResponseUtil } from '../utils/response';
import { NotFoundError, AuthorizationError, ConflictError } from '../utils/errors';
import { validatePaginationParams, calculatePagination } from '../utils/helpers';
import { Role } from '../types';

interface AuthenticatedRequest extends Request {
  userId: string;
  role: Role;
}

export const createProduct = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const product = await prisma.product.create({
      data: {
        ...req.body,
        ownerId: req.userId,
      },
    });

    res.status(201).json(
      ResponseUtil.success(product, 'Product created successfully')
    );
  } catch (error) {
    next(error);
  }
};

export const getProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { page, limit } = validatePaginationParams(req.query.page, req.query.limit);
    const { skip, take } = calculatePagination(page, limit);

    const where: any = {};

    if (req.query.search) {
      where.OR = [
        { name: { contains: req.query.search as string, mode: 'insensitive' } },
        { description: { contains: req.query.search as string, mode: 'insensitive' } },
      ];
    }

    if (req.query.categoryId) {
      where.categoryId = req.query.categoryId;
    }

    if (req.query.ownerId) {
      where.ownerId = req.query.ownerId;
    }

    const orderBy: any = {};
    if (req.query.sortBy) {
      orderBy[req.query.sortBy as string] = req.query.sortOrder || 'desc';
    } else {
      orderBy.createdAt = 'desc';
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take,
        orderBy,
      }),
      prisma.product.count({ where }),
    ]);

    res.json(
      ResponseUtil.paginated(products, page, limit, total, 'Products retrieved successfully')
    );
  } catch (error) {
    next(error);
  }
};

export const getProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: req.params.id },
    });

    if (!product) {
      throw new NotFoundError('Product not found');
    }

    res.json(
      ResponseUtil.success(product, 'Product retrieved successfully')
    );
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const existingProduct = await prisma.product.findUnique({
      where: { id: req.params.id },
    });

    if (!existingProduct) {
      throw new NotFoundError('Product not found');
    }

    if (existingProduct.ownerId !== req.userId && req.role !== Role.FARMER) {
      throw new AuthorizationError('You can only update your own products');
    }

    const product = await prisma.product.update({
      where: { id: req.params.id },
      data: req.body,
    });

    res.json(
      ResponseUtil.success(product, 'Product updated successfully')
    );
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const existingProduct = await prisma.product.findUnique({
      where: { id: req.params.id },
    });

    if (!existingProduct) {
      throw new NotFoundError('Product not found');
    }

    if (existingProduct.ownerId !== req.userId && req.role !== Role.FARMER) {
      throw new AuthorizationError('You can only delete your own products');
    }

    await prisma.product.delete({
      where: { id: req.params.id },
    });

    res.json(
      ResponseUtil.success(null, 'Product deleted successfully')
    );
  } catch (error) {
    next(error);
  }
};
