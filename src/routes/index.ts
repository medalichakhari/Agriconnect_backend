import { Router } from 'express';
import authRoutes from './auth.routes';
import productRoutes from './product.routes';
import categoryRoutes from './category.routes';
import orderRoutes from './order.routes';
import healthRoutes from './health.routes';

const router = Router();

// Mount all routes with proper prefixes
router.use('/health', healthRoutes);
router.use('/auth', authRoutes);
router.use('/products', productRoutes);
router.use('/categories', categoryRoutes);
router.use('/orders', orderRoutes);

export default router;
