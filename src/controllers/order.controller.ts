import { Request, Response } from 'express';
import { OrderService } from '../services/order.service';
import { handleError } from '../utils/response';
import { OrderStatus } from '../types';

export const createOrder = async (req: Request, res: Response) => {
  try {
    const { productId, quantity } = req.body;
    const supplierId = req.user?.userId;

    if (!supplierId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const order = await OrderService.create(
      {
        productId,
        quantity,
      },
      supplierId
    );

    res.status(201).json({
      message: 'Order created successfully',
      data: order,
    });
  } catch (err) {
    handleError(res, err);
  }
};

export const getOrders = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    const userRole = req.user?.role;

    if (!userId || !userRole) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const result = await OrderService.getAll(req.query, userId, userRole);
    res.json({
      message: 'Orders retrieved successfully',
      data: result.orders,
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

export const getOrderById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;
    const userRole = req.user?.role;

    if (!userId || !userRole) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const order = await OrderService.getById(id, userId, userRole);
    res.json({
      message: 'Order retrieved successfully',
      data: order,
    });
  } catch (err) {
    handleError(res, err);
  }
};

export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const userId = req.user?.userId;
    const userRole = req.user?.role;

    if (!userId || !userRole) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const order = await OrderService.updateStatus(id, status, userId, userRole);
    res.json({
      message: 'Order status updated successfully',
      data: order,
    });
  } catch (err) {
    handleError(res, err);
  }
};

export const cancelOrder = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;
    const userRole = req.user?.role;

    if (!userId || !userRole) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const order = await OrderService.cancel(id, userId, userRole);
    res.json({
      message: 'Order cancelled successfully',
      data: order,
    });
  } catch (err) {
    handleError(res, err);
  }
};
