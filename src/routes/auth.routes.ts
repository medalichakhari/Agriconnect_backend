import { Router } from 'express';
import {
  register,
  login,
  getProfile,
  updateProfile,
} from '../controllers/auth.controller';
import { requireAuth } from '../middleware/requireAuth';
import { validateRequest } from '../middleware/validation';
import {
  createUserSchema,
  loginUserSchema,
  updateUserSchema,
} from '../validators/user';

const router = Router();

router.post(
  '/auth/register',
  validateRequest({ body: createUserSchema }),
  register
);

router.post(
  '/auth/login',
  validateRequest({ body: loginUserSchema }),
  login
);

router.get('/auth/profile', requireAuth, getProfile);

router.put(
  '/auth/profile',
  requireAuth,
  validateRequest({ body: updateUserSchema }),
  updateProfile
);

export default router;
