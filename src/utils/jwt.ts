import jwt from "jsonwebtoken";
import { config } from "../config";
import { JwtPayload, AuthUser } from "../types";
import { AuthenticationError } from "./errors";

export class JwtUtil {
  static generateToken(payload: AuthUser): string {
    return jwt.sign(payload, config.JWT_SECRET, {
      expiresIn: config.JWT_EXPIRES_IN,
    });
  }

  static verifyToken(token: string): JwtPayload {
    try {
      return jwt.verify(token, config.JWT_SECRET) as JwtPayload;
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        throw new AuthenticationError("Invalid token");
      }
      if (error instanceof jwt.TokenExpiredError) {
        throw new AuthenticationError("Token expired");
      }
      throw new AuthenticationError("Token verification failed");
    }
  }

  static extractTokenFromHeader(authHeader?: string): string {
    if (!authHeader?.startsWith("Bearer ")) {
      throw new AuthenticationError("Invalid authorization header");
    }
    return authHeader.split(" ")[1];
  }
}
