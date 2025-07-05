import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const configSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  PORT: z.string().default("4000").transform(Number),
  DATABASE_URL: z.string().min(1, "Database URL is required"),
  JWT_SECRET: z.string().min(1, "JWT secret is required"),
  JWT_EXPIRES_IN: z.string().default("7d"),
  ALLOWED_ORIGINS: z.string().default("*"),
  API_VERSION: z.string().default("v1"),
  API_PREFIX: z.string().default("/api"),
  RATE_LIMIT_MAX: z.string().default("100").transform(Number),
  RATE_LIMIT_WINDOW_MS: z.string().default("900000").transform(Number),
  MAX_FILE_SIZE: z.string().default("5242880").transform(Number),
  UPLOAD_PATH: z.string().default("./uploads"),
});

const parseConfig = () => {
  try {
    return configSchema.parse(process.env);
  } catch (error) {
    console.error("❌ Invalid environment configuration:");
    if (error instanceof z.ZodError) {
      error.errors.forEach((err) => {
        console.error(`${err.path.join(".")}: ${err.message}`);
      });
    }
    process.exit(1);
  }
};

export const config = parseConfig();

export default config;
