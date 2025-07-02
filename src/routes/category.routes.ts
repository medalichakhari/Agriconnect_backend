import { Router } from "express";
import {
  createCategory,
  getCategories,
} from "../controllers/category.controller";
import { validate } from "../middleware/validate";
import { createCategorySchema } from "../validators/category";
import { requireAuth } from "../middleware/requireAuth";

const router = Router();

router.post(
  "/categories",
  requireAuth,
  validate(createCategorySchema),
  createCategory
);
router.get("/categories", getCategories);

export default router;
