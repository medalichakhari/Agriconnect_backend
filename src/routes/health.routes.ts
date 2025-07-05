import { Router } from 'express';
import { healthCheck, apiInfo } from '../controllers/health.controller';

const router = Router();

router.get('/health', healthCheck);
router.get('/info', apiInfo);

export default router;
