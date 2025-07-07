import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/errors";
import { ResponseUtil } from "../utils/response";
import { config } from "../config";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let error = { ...err } as AppError;
  error.message = err.message;

  // Log error
  console.error(err);

  // Mongoose bad ObjectId
  if (err.name === "CastError") {
    const message = "Resource not found";
    error = new AppError(message, 404);
  }

  // Mongoose duplicate key
  if (err.name === "ValidationError") {
    const message = "Validation Error";
    error = new AppError(message, 400);
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    const message = "Invalid token";
    error = new AppError(message, 401);
  }

  if (err.name === "TokenExpiredError") {
    const message = "Token expired";
    error = new AppError(message, 401);
  }

  // Prisma errors
  if (err.name === "PrismaClientKnownRequestError") {
    const message = "Database operation failed";
    error = new AppError(message, 400);
  }

  const statusCode = error.statusCode || 500;
  const message = error.message || "Internal Server Error";

  res
    .status(statusCode)
    .json(
      ResponseUtil.error(
        message,
        config.NODE_ENV === "development" ? err.stack : undefined
      )
    );
};
