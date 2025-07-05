import { Request, Response } from 'express';

export const healthCheck = async (req: Request, res: Response): Promise<void> => {
  try {
    const health = {
      status: 'OK',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
    };

    res.json({
      success: true,
      message: 'Service is healthy',
      data: health,
    });
  } catch (error) {
    res.status(503).json({
      success: false,
      message: 'Service is unhealthy',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export const apiInfo = (req: Request, res: Response): void => {
  const info = {
    name: 'AgriConnect API',
    version: '1.0.0',
    description: 'API for connecting farmers and buyers in agricultural marketplace',
    environment: process.env.NODE_ENV || 'development',
  };

  res.json({
    success: true,
    message: 'API information',
    data: info,
  });
};
