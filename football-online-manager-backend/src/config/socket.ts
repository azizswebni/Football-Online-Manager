import { Server as SocketIOServer } from 'socket.io';
import { Server as HTTPServer } from 'http';
import { ENV } from './env';
import logger from './logger';

export function initializeSocket(server: HTTPServer): SocketIOServer {
  const io = new SocketIOServer(server, {
    cors: {
      origin: ENV.FRONTEND_URL || "http://localhost:3000",
      credentials: true,
      methods: ["GET", "POST"]
    },
    transports: ['websocket', 'polling']
  });

  // Socket connection handling
  io.on('connection', (socket) => {
    logger.info(`User connected: ${socket.id}`);
    
    // Join user to their personal room
    socket.on('join-user-room', (userId: string) => {
      socket.join(`user-${userId}`);
      logger.info(`User ${userId} joined room: user-${userId}`);
    });
    
    socket.on('disconnect', () => {
      logger.info(`User disconnected: ${socket.id}`);
    });
  });

  logger.info('✅ Socket.IO initialized');
  return io;
}

// Global io instance
declare global {
  var io: SocketIOServer | undefined;
}

export function getIO(): SocketIOServer {
  if (!global.io) {
    throw new Error('Socket.IO not initialized');
  }
  return global.io;
} 