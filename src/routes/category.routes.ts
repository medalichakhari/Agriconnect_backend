import { Router } from "express";
import {
  createCategory,
  getCategories,
} from "../controllers/category.controller";

const router = Router();

router.post("/categories", createCategory);
router.get("/categories", getCategories);

export default router;
