import { Router } from 'express';
import authRoutes from './auth.routes';
import productRoutes from './product.routes';
import categoryRoutes from './category.routes';
import orderRoutes from './order.routes';
import healthRoutes from './health.routes';

const router = Router();

// Mount all routes
router.use(healthRoutes);
router.use(authRoutes);
router.use(productRoutes);
router.use(categoryRoutes);
router.use(orderRoutes);

export default router;
