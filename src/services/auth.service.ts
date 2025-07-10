import bcrypt from 'bcrypt';
import { prisma } from '../database';
import { JwtUtil } from '../utils/jwt';
import {
  ConflictError,
  AuthenticationError,
  NotFoundError,
} from '../utils/errors';
import { User, Role } from '../types';

export class AuthService {
  static async register(data: {
    name: string;
    email: string;
    password: string;
    role: Role;
    location?: string;
  }): Promise<{ user: Omit<User, 'password'>; token: string }> {
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new ConflictError('User already exists with this email');
    }

    const hashedPassword = await bcrypt.hash(data.password, 12);

    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        role: data.role as any, // Cast to Prisma enum
        location: data.location,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        location: true,
        createdAt: true,
      },
    });

    const token = JwtUtil.generateToken({
      userId: user.id,
      role: user.role as Role,
    });

    return { user: user as any, token };
  }

  static async login(data: {
    email: string;
    password: string;
  }): Promise<{ user: Omit<User, 'password'>; token: string }> {
    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user) {
      throw new AuthenticationError('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(data.password, user.password);

    if (!isPasswordValid) {
      throw new AuthenticationError('Invalid email or password');
    }

    const token = JwtUtil.generateToken({
      userId: user.id,
      role: user.role as Role,
    });

    const { password, ...userWithoutPassword } = user;

    return { user: userWithoutPassword as any, token };
  }

  static async getUserById(userId: string): Promise<Omit<User, 'password'>> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        location: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new NotFoundError('User not found');
    }

    return user as any;
  }

  static async updateUser(
    userId: string,
    data: { name?: string; location?: string }
  ): Promise<Omit<User, 'password'>> {
    const user = await prisma.user.update({
      where: { id: userId },
      data,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        location: true,
        createdAt: true,
      },
    });

    return user as any;
  }
}
