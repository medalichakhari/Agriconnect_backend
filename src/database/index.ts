import { PrismaClient } from "@prisma/client";
import { config } from "../config";

class DatabaseManager {
  private static instance: PrismaClient;

  public static getInstance(): PrismaClient {
    if (!DatabaseManager.instance) {
      DatabaseManager.instance = new PrismaClient({
        log:
          config.NODE_ENV === "development"
            ? ["query", "error", "warn"]
            : ["error"],
      });
    }
    return DatabaseManager.instance;
  }

  public static async connect(): Promise<void> {
    try {
      const prisma = DatabaseManager.getInstance();
      await prisma.$connect();
      console.log("✅ Connected to PostgreSQL");
    } catch (error) {
      console.error("❌ Failed to connect to database:", error);
      throw error;
    }
  }

  public static async disconnect(): Promise<void> {
    try {
      const prisma = DatabaseManager.getInstance();
      await prisma.$disconnect();
      console.log("✅ Disconnected from PostgreSQL");
    } catch (error) {
      console.error("❌ Failed to disconnect from database:", error);
      throw error;
    }
  }

  public static async healthCheck(): Promise<boolean> {
    try {
      const prisma = DatabaseManager.getInstance();
      await prisma.$queryRaw`SELECT 1`;
      return true;
    } catch (error) {
      console.error("❌ Database health check failed:", error);
      return false;
    }
  }
}

export const prisma = DatabaseManager.getInstance();
export default DatabaseManager;
