import { Router } from 'express';
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from '../controllers/product.controller';
import { requireAuth } from '../middleware/requireAuth';

const router = Router();

router.post('/', requireAuth, createProduct);
router.get('/', getAllProducts);
router.get('/:id', getProductById);
router.put('/:id', requireAuth, updateProduct);
router.delete('/:id', requireAuth, deleteProduct);

export default router;
