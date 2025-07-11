import express, { Application, Request, Response, NextFunction } from 'express';
import { createServer } from 'http';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './config/swagger';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { AppDataSource } from './config/data-source';
import cookieParser from 'cookie-parser';
import logger from './config/logger';
import { errorHandler } from './middlewares/errorHandler';
import { notFoundHandler } from './middlewares/notFoundHandler';
import { requestLogger } from './middlewares/requestLogger';
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import transferRoutes from './routes/transfer.routes';
import { initializeJobProcessors } from './jobs';
import { serverAdapter } from './config/bullBoard';
import { initializeSocket } from './config/socket';

class App {
  public app: Application;
  public server: any;
  public port: number;

  constructor() {
    this.app = express();
    this.port = Number(process.env.PORT) || 4000;
    this.initializeMiddlewares();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  private initializeMiddlewares(): void {
    // Security middleware
    this.app.use(helmet());
    this.app.use(cors({
      origin: process.env.FRONTEND_URL || 'http://localhost:3000',
      credentials: true
    }));

    // Body parsing middleware
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true }));

    // Cookie parsing middleware
    this.app.use(cookieParser());

    // Compression middleware
    this.app.use(compression());

    // Request logging middleware
    this.app.use(requestLogger);

    // Health check endpoint
    this.app.get('/health', (req: Request, res: Response) => {
      logger.info('Health check requested');
      res.status(200).json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
      });
    });
  }

  private initializeRoutes(): void {
    // API routes
    this.app.use('/api/auth', authRoutes);
    this.app.use('/api/user', userRoutes);
    this.app.use('/api/transfer', transferRoutes);

    // API documentation endpoint
    this.app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

    // Bull Board monitoring dashboard
    this.app.use('/admin/queues', serverAdapter.getRouter());
  }

  private initializeErrorHandling(): void {
    // 404 handler
    this.app.use(notFoundHandler);

    // Global error handler
    this.app.use(errorHandler);
  }

  public async initializeDatabase(): Promise<void> {
    try {
      await AppDataSource.initialize();
      logger.info('✅ Database connection established');
    } catch (error) {
      logger.error('❌ Database connection failed:', error);
      process.exit(1);
    }
  }

  public initializeJobQueues(): void {
    try {
      initializeJobProcessors();
      logger.info('✅ Job queues initialized');
    } catch (error) {
      logger.error('❌ Job queues initialization failed:', error);
      process.exit(1);
    }
  }

  public initializeSocketIO(): void {
    try {
      // Create HTTP server
      this.server = createServer(this.app);
      
      // Initialize Socket.IO
      const io = initializeSocket(this.server);
      
      // Store io instance globally
      (global as any).io = io;
      
      logger.info('✅ Socket.IO initialized');
    } catch (error) {
      logger.error('❌ Socket.IO initialization failed:', error);
      process.exit(1);
    }
  }

  public listen(): void {
    if (!this.server) {
      throw new Error('HTTP server not initialized');
    }

    this.server.listen(this.port, () => {
      logger.info(`🚀 Server running on port ${this.port}`);
      logger.info(`📊 Environment: ${process.env.NODE_ENV}`);
      logger.info(`🩺 Health check: http://localhost:${this.port}/health`);
      logger.info(`📚 API docs: http://localhost:${this.port}/api/docs`);
      logger.info(`📈 Queue monitoring: http://localhost:${this.port}/admin/queues`);
      logger.info(`🔌 Socket.IO: ws://localhost:${this.port}`);
    });
  }
}

export default App;