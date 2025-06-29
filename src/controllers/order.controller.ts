import { Request, Response } from "express";
import prisma from "../prisma/client";

export const createOrder = async (req: Request, res: Response) => {
  try {
    const { productId, buyerId, quantity } = req.body;

    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const total = product.price * quantity;

    const order = await prisma.order.create({
      data: {
        productId,
        buyerId,
        quantity,
        total,
      },
    });

    return res.status(201).json(order);
  } catch (err) {
    return res.status(500).json({
      message: "❌ Error creating order",
      error: err instanceof Error ? err.message : err,
    });
  }
};
