import { Router } from 'express';
import {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrder,
} from '../controllers/order.controller';
import { requireAuth } from '../middleware/requireAuth';

const router = Router();

router.post('/', requireAuth, createOrder);
router.get('/', requireAuth, getOrders);
router.get('/:id', requireAuth, getOrderById);
router.put('/:id/status', requireAuth, updateOrderStatus);
router.put('/:id/cancel', requireAuth, cancelOrder);

export default router;
