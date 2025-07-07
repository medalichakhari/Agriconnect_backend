import { prisma } from '../database';
import { NotFoundError, ConflictError } from '../utils/errors';
import { Category } from '../types';
import { calculatePagination, validatePaginationParams } from '../utils/helpers';

export class CategoryService {
  static async create(data: { name: string }): Promise<Category> {
    const existingCategory = await prisma.category.findUnique({
      where: { name: data.name },
    });

    if (existingCategory) {
      throw new ConflictError('Category already exists with this name');
    }

    const category = await prisma.category.create({
      data,
    });

    return category as any;
  }

  static async getAll(query: {
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }) {
    const { page, limit } = validatePaginationParams(query.page, query.limit);
    const { skip, take } = calculatePagination(page, limit);

    const where: any = {};

    if (query.search) {
      where.name = { contains: query.search, mode: 'insensitive' };
    }

    const orderBy: any = {};
    if (query.sortBy) {
      orderBy[query.sortBy] = query.sortOrder || 'desc';
    } else {
      orderBy.createdAt = 'desc';
    }

    const [categories, total] = await Promise.all([
      prisma.category.findMany({
        where,
        skip,
        take,
        orderBy,
        include: {
          products: {
            select: { id: true },
          },
        },
      }),
      prisma.category.count({ where }),
    ]);

    return { categories, total, page, limit };
  }

  static async getById(categoryId: string): Promise<Category & { productCount: number }> {
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
      include: {
        products: {
          select: { id: true },
        },
      },
    });

    if (!category) {
      throw new NotFoundError('Category not found');
    }

    return {
      ...category,
      productCount: category.products.length,
    } as any;
  }

  static async update(
    categoryId: string,
    data: { name?: string }
  ): Promise<Category> {
    const existingCategory = await prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!existingCategory) {
      throw new NotFoundError('Category not found');
    }

    if (data.name) {
      const duplicateCategory = await prisma.category.findFirst({
        where: {
          name: data.name,
          id: { not: categoryId },
        },
      });

      if (duplicateCategory) {
        throw new ConflictError('Category already exists with this name');
      }
    }

    const category = await prisma.category.update({
      where: { id: categoryId },
      data,
    });

    return category as any;
  }

  static async delete(categoryId: string): Promise<void> {
    const existingCategory = await prisma.category.findUnique({
      where: { id: categoryId },
      include: {
        products: {
          select: { id: true },
        },
      },
    });

    if (!existingCategory) {
      throw new NotFoundError('Category not found');
    }

    if (existingCategory.products.length > 0) {
      throw new ConflictError('Cannot delete category that has products');
    }

    await prisma.category.delete({
      where: { id: categoryId },
    });
  }
}
