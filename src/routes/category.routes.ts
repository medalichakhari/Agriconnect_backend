import { Router } from 'express';
import {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from '../controllers/category.controller';
import { requireAuth } from '../middleware/requireAuth';

const router = Router();

router.post('/', requireAuth, createCategory);
router.get('/', getCategories);
router.get('/:id', getCategoryById);
router.put('/:id', requireAuth, updateCategory);
router.delete('/:id', requireAuth, deleteCategory);

export default router;
