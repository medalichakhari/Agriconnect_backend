import express from 'express';
import cors from 'cors';
import { config } from './config';
import DatabaseManager from './database';
import routes from './routes';
import { errorHandler } from './middleware/errorHandler';
import { requestLogger, notFound } from './middleware/common';

class App {
  public app: express.Application;

  constructor() {
    this.app = express();
    this.initializeMiddlewares();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  private initializeMiddlewares(): void {
    // CORS configuration
    const corsOptions = {
      origin: config.ALLOWED_ORIGINS === '*' 
        ? true 
        : config.ALLOWED_ORIGINS.split(',').map(origin => origin.trim()),
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    };

    this.app.use(cors(corsOptions));
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));
    
    // Request logging in development
    if (config.NODE_ENV === 'development') {
      this.app.use(requestLogger);
    }
  }

  private initializeRoutes(): void {
    // Health check endpoint
    this.app.get('/', (_, res) => {
      res.json({
        success: true,
        message: 'AgriConnect API is running ✅',
        version: process.env.npm_package_version || '1.0.0',
        timestamp: new Date().toISOString(),
      });
    });

    // API routes
    this.app.use(`${config.API_PREFIX}/${config.API_VERSION}`, routes);
  }

  private initializeErrorHandling(): void {
    // 404 handler
    this.app.use('*', notFound);
    
    // Global error handler
    this.app.use(errorHandler);
  }

  public async start(): Promise<void> {
    try {
      // Connect to database
      await DatabaseManager.connect();

      // Start server
      this.app.listen(config.PORT, () => {
        console.log(`🚀 Server is running on port ${config.PORT}`);
        console.log(`📚 API Documentation: http://localhost:${config.PORT}${config.API_PREFIX}/${config.API_VERSION}/info`);
        console.log(`🏥 Health Check: http://localhost:${config.PORT}${config.API_PREFIX}/${config.API_VERSION}/health`);
        console.log(`🌍 Environment: ${config.NODE_ENV}`);
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
        await DatabaseManager.disconnect();
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
app.start().catch((error) => {
  console.error('❌ Failed to start application:', error);
  process.exit(1);
});
