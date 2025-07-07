import { z } from 'zod';

export const createOrderSchema = z.object({
  productId: z.string().uuid('Invalid product ID format'),
  quantity: z.number().int().positive('Quantity must be positive integer'),
});

export const updateOrderSchema = z.object({
  status: z.enum(['PENDING', 'CONFIRMED', 'DELIVERED', 'CANCELLED'], {
    required_error: 'Status is required',
  }),
});

export const orderParamsSchema = z.object({
  id: z.string().uuid('Invalid order ID format'),
});

export const orderQuerySchema = z.object({
  page: z
    .string()
    .optional()
    .transform(val => (val ? parseInt(val, 10) : undefined)),
  limit: z
    .string()
    .optional()
    .transform(val => (val ? parseInt(val, 10) : undefined)),
  status: z.enum(['PENDING', 'CONFIRMED', 'DELIVERED', 'CANCELLED']).optional(),
  supplierId: z.string().uuid('Invalid supplier ID format').optional(),
  productId: z.string().uuid('Invalid product ID format').optional(),
  sortBy: z.enum(['createdAt', 'total', 'status']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
});
