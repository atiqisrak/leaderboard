import { Server } from 'socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import redis from './index';
import { createClient } from 'redis';
import jwt from 'jsonwebtoken';
import { config } from './config/config';
import { ChatRedisService, ChatMessage } from './redis-chat';

interface SocketOptions {
  cors: {
    origin: string | string[];
    methods: string[];
    credentials: boolean;
  };
}

export async function setupSocketIO(httpServer: any, options?: SocketOptions) {
  const io = new Server(httpServer, {
    cors: options?.cors || {
      origin: process.env.CLIENT_URL || ['http://localhost:3000', 'http://localhost:3096', 'http://localhost:3097'],
      methods: ['GET', 'POST', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true,
      preflightContinue: false,
      optionsSuccessStatus: 204
    },
    transports: ['websocket', 'polling'],
    allowEIO3: true,
    pingTimeout: 60000,
    pingInterval: 25000,
    connectTimeout: 45000,
    upgradeTimeout: 30000
  });

  // Create Redis pub/sub clients
  const pubClient = createClient({
    url: `redis://${redis.options.host}:${redis.options.port}`,
    password: redis.options.password
  });
  const subClient = pubClient.duplicate();

  // Connect Redis clients
  await Promise.all([pubClient.connect(), subClient.connect()]);

  // Set up Redis adapter
  io.adapter(createAdapter(pubClient, subClient));

  // Socket.IO connection handling with authentication
  io.use(async (socket, next) => {
    try {
      let token = socket.handshake.auth.token;
      console.log('Debug - Received token:', token);
      if (!token) {
        return next(new Error('Authentication token required'));
      }
      // Remove Bearer prefix if present
      if (token.startsWith('Bearer ')) {
        token = token.slice(7);
      }
      console.log('Debug - Token after processing:', token);
      const decoded = jwt.verify(token, config.jwt.secret as string) as { id: string };
      console.log('Debug - Decoded token:', decoded);
      socket.data.userId = decoded.id;
      next();
    } catch (error) {
      console.error('Debug - Token verification error:', error);
      next(new Error('Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    const userId = socket.data.userId;
    console.log('User connected:', socket.id, 'UserId:', userId);

    // Handle user joining a room
    socket.on('join_room', (roomId: string) => {
      socket.join(roomId);
      console.log(`User ${userId} joined room: ${roomId}`);
    });

    // Handle chat messages
    socket.on('send_message', async (data: { roomId: string; message: string }) => {
      const { roomId, message } = data;
      
      // Create message object
      const messageData: ChatMessage = {
        id: Date.now(),
        userId,
        message,
        timestamp: new Date().toISOString()
      };
      
      // Store message and update chat lists
      await ChatRedisService.addMessage(roomId, messageData);

      // Broadcast message to room
      io.to(roomId).emit('receive_message', messageData);
    });

    // Handle user typing status
    socket.on('typing', (data: { roomId: string; isTyping: boolean }) => {
      socket.to(data.roomId).emit('user_typing', {
        userId,
        isTyping: data.isTyping
      });
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id, 'UserId:', userId);
    });
  });

  return io;
} 