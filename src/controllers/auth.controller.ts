import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
import { ResponseUtil } from '../utils/response';

interface AuthenticatedRequest extends Request {
  userId: string;
  role: string;
}

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { user, token } = await AuthService.register(req.body);
    
    res.status(201).json(
      ResponseUtil.success(
        { user, token },
        'User registered successfully'
      )
    );
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { user, token } = await AuthService.login(req.body);
    
    res.json(
      ResponseUtil.success(
        { user, token },
        'Login successful'
      )
    );
  } catch (error) {
    next(error);
  }
};

export const getProfile = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = await AuthService.getUserById(req.userId);
    
    res.json(
      ResponseUtil.success(user, 'Profile retrieved successfully')
    );
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = await AuthService.updateUser(req.userId, req.body);
    
    res.json(
      ResponseUtil.success(user, 'Profile updated successfully')
    );
  } catch (error) {
    next(error);
  }
};
