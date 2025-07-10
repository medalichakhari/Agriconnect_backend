import { Request, Response, NextFunction } from 'express';
import { JwtUtil } from '../utils/jwt';
import { AuthenticationError } from '../utils/errors';
import { ResponseUtil } from '../utils/response';
import { Role } from '../types';

export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization;
    const token = JwtUtil.extractTokenFromHeader(authHeader);
    const payload = JwtUtil.verifyToken(token);

    req.user = {
      userId: payload.userId,
      role: payload.role,
    };

    next();
  } catch (error) {
    if (error instanceof AuthenticationError) {
      res.status(401).json(ResponseUtil.error(error.message));
      return;
    }
    res.status(401).json(ResponseUtil.error('Authentication failed'));
  }
};

export const requireRole = (roles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user?.role || !roles.includes(req.user.role)) {
      res.status(403).json(ResponseUtil.error('Access forbidden'));
      return;
    }
    next();
  };
};
