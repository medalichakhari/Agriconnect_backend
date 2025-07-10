import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { handleError } from '../utils/response';

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, role, location } = req.body;

    const result = await AuthService.register({
      name,
      email,
      password,
      role,
      location,
    }); 

    res.status(201).json({
      message: 'User registered successfully',
      user: result.user,
      token: result.token,
    });
  } catch (err) {
    handleError(res, err);
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const result = await AuthService.login({ email, password });

    res.json({
      message: 'Login successful',
      user: result.user,
      token: result.token,
    });
  } catch (err) {
    handleError(res, err);
  }
};

export const getProfile = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const user = await AuthService.getUserById(userId);

    res.json({
      message: 'Profile retrieved successfully',
      user,
    });
  } catch (err) {
    handleError(res, err);
  }
};

export const updateProfile = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const { name, location } = req.body;

    const user = await AuthService.updateUser(userId, { name, location });

    res.json({
      message: 'Profile updated successfully',
      user,
    });
  } catch (err) {
    handleError(res, err);
  }
};
