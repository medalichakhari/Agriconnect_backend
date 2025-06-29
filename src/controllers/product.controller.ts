import { Request, Response } from "express";
import prisma from "../prisma/client";

export const createProduct = async (req: Request, res: Response) => {
  try {
    const { name, description, category, price, quantity, imageUrl, ownerId } = req.body;

    const product = await prisma.product.create({
      data: {
        name,
        description,
        category,
        price,
        quantity,
        imageUrl,
        ownerId,
      },
    });

    res.status(201).json(product);
  } catch (error) {
    console.error("❌ Error creating product:", error);
    res.status(500).json({ error: "Failed to create product" });
  }
};

export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const products = await prisma.product.findMany({
      include: {
        owner: {
          select: { id: true, name: true, location: true },
        },
      },
    });
    res.json(products);
  } catch (error) {
    console.error("❌ Error fetching products:", error);
    res.status(500).json({ error: "Failed to fetch products" });
  }
};
