import { prisma } from '../database';
import { NotFoundError, AuthorizationError, ValidationError } from '../utils/errors';
import { Order, OrderStatus, Role } from '../types';
import { calculatePagination, validatePaginationParams } from '../utils/helpers';

export class OrderService {
  static async create(
    data: { productId: string; quantity: number },
    buyerId: string
  ): Promise<Order> {
    const product = await prisma.product.findUnique({
      where: { id: data.productId },
    });

    if (!product) {
      throw new NotFoundError('Product not found');
    }

    if (product.quantity < data.quantity) {
      throw new ValidationError('Insufficient product quantity available');
    }

    const total = product.price * data.quantity;

    const [order] = await prisma.$transaction([
      prisma.order.create({
        data: {
          productId: data.productId,
          buyerId,
          quantity: data.quantity,
          total,
        },
        include: {
          product: {
            select: { id: true, name: true, price: true },
          },
          buyer: {
            select: { id: true, name: true, email: true },
          },
        },
      }),
      prisma.product.update({
        where: { id: data.productId },
        data: {
          quantity: {
            decrement: data.quantity,
          },
        },
      }),
    ]);

    return order as any;
  }

  static async getAll(
    query: {
      page?: number;
      limit?: number;
      status?: OrderStatus;
      buyerId?: string;
      productId?: string;
      sortBy?: string;
      sortOrder?: 'asc' | 'desc';
    },
    userId: string,
    userRole: Role
  ) {
    const { page, limit } = validatePaginationParams(query.page, query.limit);
    const { skip, take } = calculatePagination(page, limit);

    const where: any = {};

    // Role-based filtering
    if (userRole === Role.BUYER) {
      where.buyerId = userId;
    } else if (userRole === Role.FARMER) {
      where.product = {
        ownerId: userId,
      };
    }

    if (query.status) {
      where.status = query.status;
    }

    if (query.buyerId) {
      where.buyerId = query.buyerId;
    }

    if (query.productId) {
      where.productId = query.productId;
    }

    const orderBy: any = {};
    if (query.sortBy) {
      orderBy[query.sortBy] = query.sortOrder || 'desc';
    } else {
      orderBy.createdAt = 'desc';
    }

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        skip,
        take,
        orderBy,
        include: {
          product: {
            select: { id: true, name: true, price: true },
          },
          buyer: {
            select: { id: true, name: true, email: true },
          },
        },
      }),
      prisma.order.count({ where }),
    ]);

    return { orders, total, page, limit };
  }

  static async getById(orderId: string, userId: string, userRole: Role): Promise<Order> {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        product: {
          include: {
            owner: {
              select: { id: true, name: true, email: true },
            },
          },
        },
        buyer: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    if (!order) {
      throw new NotFoundError('Order not found');
    }

    // Check authorization
    const isOwner = order.buyerId === userId;
    const isProductOwner = order.product.ownerId === userId;

    if (!isOwner && !isProductOwner) {
      throw new AuthorizationError('You can only view your own orders');
    }

    return order as any;
  }

  static async updateStatus(
    orderId: string,
    status: OrderStatus,
    userId: string,
    userRole: Role
  ): Promise<Order> {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        product: true,
      },
    });

    if (!order) {
      throw new NotFoundError('Order not found');
    }

    // Only product owner (farmer) can update order status
    if (order.product.ownerId !== userId) {
      throw new AuthorizationError('Only the product owner can update order status');
    }

    // Validate status transitions
    if (order.status === OrderStatus.CANCELLED || order.status === OrderStatus.DELIVERED) {
      throw new ValidationError('Cannot update status of completed orders');
    }

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { status },
      include: {
        product: {
          select: { id: true, name: true, price: true },
        },
        buyer: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    return updatedOrder as any;
  }

  static async cancel(orderId: string, userId: string, userRole: Role): Promise<Order> {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        product: true,
      },
    });

    if (!order) {
      throw new NotFoundError('Order not found');
    }

    // Only buyer can cancel their own order or farmer can cancel orders for their products
    const isOwner = order.buyerId === userId;
    const isProductOwner = order.product.ownerId === userId;

    if (!isOwner && !isProductOwner) {
      throw new AuthorizationError('You can only cancel your own orders');
    }

    if (order.status === OrderStatus.DELIVERED) {
      throw new ValidationError('Cannot cancel delivered orders');
    }

    if (order.status === OrderStatus.CANCELLED) {
      throw new ValidationError('Order is already cancelled');
    }

    const [updatedOrder] = await prisma.$transaction([
      prisma.order.update({
        where: { id: orderId },
        data: { status: OrderStatus.CANCELLED },
        include: {
          product: {
            select: { id: true, name: true, price: true },
          },
          buyer: {
            select: { id: true, name: true, email: true },
          },
        },
      }),
      prisma.product.update({
        where: { id: order.productId },
        data: {
          quantity: {
            increment: order.quantity,
          },
        },
      }),
    ]);

    return updatedOrder as any;
  }
}
