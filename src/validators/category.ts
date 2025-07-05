import { z } from "zod";

export const createCategorySchema = z.object({
  name: z
    .string()
    .min(1, "Category name is required")
    .max(100, "Name too long"),
});

export const updateCategorySchema = z.object({
  name: z
    .string()
    .min(1, "Category name is required")
    .max(100, "Name too long")
    .optional(),
});

export const categoryParamsSchema = z.object({
  id: z.string().uuid("Invalid category ID format"),
});

export const categoryQuerySchema = z.object({
  page: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : undefined)),
  limit: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : undefined)),
  search: z.string().optional(),
  sortBy: z.enum(["createdAt", "name"]).optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
});
