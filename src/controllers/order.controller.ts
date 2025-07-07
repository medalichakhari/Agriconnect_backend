import { Request, Response } from 'express';
import prisma from '../prisma/client';

export const createOrder = async (req: Request, res: Response) => {
  try {
    const { productId, supplierId, quantity } = req.body;

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });
    if (!product) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }

    const total = product.price * quantity;

    const order = await prisma.order.create({
      data: {
        productId,
        supplierId,
        quantity,
        total,
      },
    });

    res.status(201).json(order);
    return;
  } catch (err) {
    res.status(500).json({
      message: '❌ Error creating order',
      error: err instanceof Error ? err.message : err,
    });
    return;
  }
};
