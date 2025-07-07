import { z } from "zod";

export const createProductSchema = z.object({
  name: z.string().min(1, "Product name is required").max(200, "Name too long"),
  description: z.string().max(1000, "Description too long").optional(),
  price: z.number().positive("Price must be positive"),
  quantity: z.number().int().positive("Quantity must be positive integer"),
  imageUrl: z.string().url("Invalid image URL").optional(),
  categoryId: z.string().uuid("Invalid category ID format").optional(),
});

export const updateProductSchema = z.object({
  name: z
    .string()
    .min(1, "Product name is required")
    .max(200, "Name too long")
    .optional(),
  description: z.string().max(1000, "Description too long").optional(),
  price: z.number().positive("Price must be positive").optional(),
  quantity: z
    .number()
    .int()
    .positive("Quantity must be positive integer")
    .optional(),
  imageUrl: z.string().url("Invalid image URL").optional(),
  categoryId: z.string().uuid("Invalid category ID format").optional(),
});

export const productParamsSchema = z.object({
  id: z.string().uuid("Invalid product ID format"),
});

export const productQuerySchema = z.object({
  page: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : undefined)),
  limit: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : undefined)),
  search: z.string().optional(),
  categoryId: z.string().uuid("Invalid category ID format").optional(),
  ownerId: z.string().uuid("Invalid owner ID format").optional(),
  sortBy: z.enum(["createdAt", "price", "name"]).optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
});
