import { Request, Response } from 'express';
import DatabaseManager from '../database';
import { ResponseUtil } from '../utils/response';
import { config } from '../config';

export const healthCheck = async (req: Request, res: Response): Promise<void> => {
  try {
    const dbHealth = await DatabaseManager.healthCheck();
    
    const health = {
      status: 'OK',
      timestamp: new Date().toISOString(),
      environment: config.NODE_ENV,
      version: process.env.npm_package_version || '1.0.0',
      uptime: process.uptime(),
      database: dbHealth ? 'Connected' : 'Disconnected',
    };

    res.json(ResponseUtil.success(health, 'Service is healthy'));
  } catch (error) {
    res.status(503).json(
      ResponseUtil.error('Service is unhealthy', error instanceof Error ? error.message : 'Unknown error')
    );
  }
};

export const apiInfo = (req: Request, res: Response): void => {
  const info = {
    name: 'AgriConnect API',
    version: process.env.npm_package_version || '1.0.0',
    description: 'API for connecting farmers and buyers in agricultural marketplace',
    environment: config.NODE_ENV,
    documentation: '/api-docs',
    endpoints: {
      auth: '/api/auth',
      products: '/api/products',
      categories: '/api/categories',
      orders: '/api/orders',
      health: '/api/health',
    },
  };

  res.json(ResponseUtil.success(info, 'API information'));
};
