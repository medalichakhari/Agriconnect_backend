import { z } from "zod";

export const createOrderSchema = z.object({
  productId: z.string().uuid("Invalid productId"),
  buyerId: z.string().uuid("Invalid buyerId"),
  quantity: z.number().int().positive("Quantity must be a positive integer"),
});
