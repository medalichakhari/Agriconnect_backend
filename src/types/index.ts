import { Request } from 'express';

export enum Role {
  SUPPLIER = 'SUPPLIER',
  FARMER = 'FARMER',
}

export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  location?: string;
  createdAt: Date;
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  quantity: number;
  imageUrl?: string;
  ownerId: string;
  categoryId?: string;
  createdAt: Date;
}

export interface Category {
  id: string;
  name: string;
  createdAt: Date;
}

export interface Order {
  id: string;
  productId: string;
  supplierId: string;
  quantity: number;
  total: number;
  status: OrderStatus;
  createdAt: Date;
}

export interface AuthUser {
  userId: string;
  role: Role;
}

export interface PaginationQuery {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
}

export interface JwtPayload {
  userId: string;
  role: Role;
  iat?: number;
  exp?: number;
}

export interface AuthenticatedRequest extends Request {
  user?: AuthUser;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}
