import { Request, Response, NextFunction } from "express";

export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;
    const { method, originalUrl } = req;
    const { statusCode } = res;

    console.log(`${method} ${originalUrl} ${statusCode} - ${duration}ms`);
  });

  next();
};

export const notFound = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const error = new Error(`Route ${req.originalUrl} not found`);
  res.status(404).json({
    success: false,
    message: error.message,
  });
};
