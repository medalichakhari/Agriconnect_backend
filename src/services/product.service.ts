import { prisma } from "../database";
import { NotFoundError, AuthorizationError } from "../utils/errors";
import { Product, Role } from "../types";
import {
  calculatePagination,
  validatePaginationParams,
} from "../utils/helpers";

export class ProductService {
  static async create(
    data: {
      name: string;
      description?: string;
      price: number;
      quantity: number;
      imageUrl?: string;
      categoryId?: string;
    },
    ownerId: string
  ): Promise<Product> {
    const product = await prisma.product.create({
      data: {
        ...data,
        ownerId,
      },
      include: {
        owner: {
          select: { id: true, name: true, role: true },
        },
        category: {
          select: { id: true, name: true },
        },
      },
    });

    return product as any;
  }

  static async getAll(query: {
    page?: number;
    limit?: number;
    search?: string;
    categoryId?: string;
    ownerId?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
  }) {
    const { page, limit } = validatePaginationParams(query.page, query.limit);
    const { skip, take } = calculatePagination(page, limit);

    const where: any = {};

    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: "insensitive" } },
        { description: { contains: query.search, mode: "insensitive" } },
      ];
    }

    if (query.categoryId) {
      where.categoryId = query.categoryId;
    }

    if (query.ownerId) {
      where.ownerId = query.ownerId;
    }

    const orderBy: any = {};
    if (query.sortBy) {
      orderBy[query.sortBy] = query.sortOrder || "desc";
    } else {
      orderBy.createdAt = "desc";
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take,
        orderBy,
        include: {
          owner: {
            select: { id: true, name: true, role: true },
          },
          category: {
            select: { id: true, name: true },
          },
        },
      }),
      prisma.product.count({ where }),
    ]);

    return { products, total, page, limit };
  }

  static async getById(productId: string): Promise<Product> {
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        owner: {
          select: { id: true, name: true, role: true },
        },
        category: {
          select: { id: true, name: true },
        },
      },
    });

    if (!product) {
      throw new NotFoundError("Product not found");
    }

    return product as any;
  }

  static async update(
    productId: string,
    data: {
      name?: string;
      description?: string;
      price?: number;
      quantity?: number;
      imageUrl?: string;
      categoryId?: string;
    },
    userId: string,
    userRole: Role
  ): Promise<Product> {
    const existingProduct = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!existingProduct) {
      throw new NotFoundError("Product not found");
    }

    if (existingProduct.ownerId !== userId && userRole !== Role.FARMER) {
      throw new AuthorizationError("You can only update your own products");
    }

    const product = await prisma.product.update({
      where: { id: productId },
      data,
      include: {
        owner: {
          select: { id: true, name: true, role: true },
        },
        category: {
          select: { id: true, name: true },
        },
      },
    });

    return product as any;
  }

  static async delete(
    productId: string,
    userId: string,
    userRole: Role
  ): Promise<void> {
    const existingProduct = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!existingProduct) {
      throw new NotFoundError("Product not found");
    }

    if (existingProduct.ownerId !== userId && userRole !== Role.FARMER) {
      throw new AuthorizationError("You can only delete your own products");
    }

    await prisma.product.delete({
      where: { id: productId },
    });
  }
}
