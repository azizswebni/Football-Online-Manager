import 'reflect-metadata';
import App from './app';
import { ENV } from './config/env';

const startServer = async (): Promise<void> => {
  try {
    const app = new App();
    
    // Initialize database connection
    await app.initializeDatabase();
    
    // Initialize job queues
    app.initializeJobQueues();
    
    // Initialize Socket.IO
    app.initializeSocketIO();
    
    // Start the server
    app.listen();
    
    // Graceful shutdown handling
    process.on('SIGTERM', () => {
      console.log('SIGTERM received, shutting down gracefully');
      process.exit(0);
    });

    process.on('SIGINT', () => {
      console.log('SIGINT received, shutting down gracefully');
      process.exit(0);
    });

  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
