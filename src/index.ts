import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

dotenv.config();

class App {
  public app: express.Application;
  private prisma: PrismaClient;

  constructor() {
    this.app = express();
    this.prisma = new PrismaClient();
    this.initializeMiddlewares();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  private initializeMiddlewares(): void {
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }

  private initializeRoutes(): void {
    // Basic health check only
    this.app.get('/', (_, res) => {
      res.json({
        success: true,
        message: 'AgriConnect API is running ✅',
        version: '1.0.0',
        timestamp: new Date().toISOString(),
      });
    });

    // Simple test routes without external dependencies
    this.app.get('/test', (_, res) => {
      res.json({ message: 'Test route working' });
    });
  }

  private initializeErrorHandling(): void {
    // 404 handler
    this.app.use('*', (req, res) => {
      res.status(404).json({
        success: false,
        message: `Route ${req.originalUrl} not found`,
      });
    });

    // Global error handler
    this.app.use(
      (
        error: Error,
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
      ) => {
        console.error('Error occurred:', error);
        res.status(500).json({
          success: false,
          message: 'Internal server error',
        });
      }
    );
  }

  public async start(): Promise<void> {
    try {
      const PORT = process.env.PORT || 4000;

      // Try to connect to database (optional for development)
      try {
        await this.prisma.$connect();
        console.log('✅ Connected to PostgreSQL');
      } catch (dbError) {
        console.log(
          '⚠️  Database not available - starting in development mode without DB'
        );
        console.log(
          '   To enable database, ensure PostgreSQL is running and DATABASE_URL is correct'
        );
      }

      // Start server
      this.app.listen(PORT, () => {
        console.log(`🚀 Server is running on port ${PORT}`);
        console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
        console.log(`📖 API Endpoints:`);
        console.log(
          `   GET  http://localhost:${PORT}/           - Health check`
        );
        console.log(
          `   GET  http://localhost:${PORT}/test       - Test endpoint`
        );
      });

      // Graceful shutdown
      this.setupGracefulShutdown();
    } catch (error) {
      console.error('❌ Failed to start server:', error);
      process.exit(1);
    }
  }

  private setupGracefulShutdown(): void {
    const shutdown = async (signal: string) => {
      console.log(`\n📤 Received ${signal}, shutting down gracefully...`);

      try {
        await this.prisma.$disconnect();
        console.log('✅ Server shut down gracefully');
        process.exit(0);
      } catch (error) {
        console.error('❌ Error during shutdown:', error);
        process.exit(1);
      }
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
  }
}

// Start the application
const app = new App();
app.start().catch(error => {
  console.error('❌ Failed to start application:', error);
  process.exit(1);
});
