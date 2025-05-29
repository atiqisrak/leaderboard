import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import Redis from 'ioredis';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

// Validate environment variables
const requiredEnvVars = ['REDIS_URL', 'CLIENT_URL'];
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);
if (missingEnvVars.length > 0) {
  console.error('Missing required environment variables:', missingEnvVars.join(', '));
  process.exit(1);
}

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Redis client with error handling
const redis = new Redis(process.env.REDIS_URL || '', {
  retryStrategy: (times) => {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
  maxRetriesPerRequest: 3
});

redis.on('error', (error) => {
  console.error('Redis connection error:', error);
});

redis.on('connect', () => {
  console.log('Successfully connected to Redis');
});

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}));
app.use(express.json());

// Rate limiting middleware
const rateLimit = new Map();
const RATE_LIMIT_WINDOW = 60000; // 1 minute
const MAX_REQUESTS = 100; // 100 requests per minute

app.use((req, res, next) => {
  const ip = req.ip;
  const now = Date.now();
  
  if (!rateLimit.has(ip)) {
    rateLimit.set(ip, { count: 1, timestamp: now });
  } else {
    const userData = rateLimit.get(ip);
    if (now - userData.timestamp > RATE_LIMIT_WINDOW) {
      rateLimit.set(ip, { count: 1, timestamp: now });
    } else if (userData.count >= MAX_REQUESTS) {
      return res.status(429).json({ error: 'Too many requests' });
    } else {
      userData.count++;
    }
  }
  next();
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  // Join a room
  socket.on('join_room', (roomId: string) => {
    if (typeof roomId !== 'string' || !roomId) {
      socket.emit('error', 'Invalid room ID');
      return;
    }
    socket.join(roomId);
    console.log(`User ${socket.id} joined room: ${roomId}`);
  });

  // Leave a room
  socket.on('leave_room', (roomId: string) => {
    if (typeof roomId !== 'string' || !roomId) {
      socket.emit('error', 'Invalid room ID');
      return;
    }
    socket.leave(roomId);
    console.log(`User ${socket.id} left room: ${roomId}`);
  });

  // Handle chat messages
  socket.on('send_message', async (data: { roomId: string; message: string; userId: string; username: string }) => {
    try {
      const { roomId, message, userId, username } = data;
      
      // Input validation
      if (!roomId || !message || !userId || !username) {
        socket.emit('error', 'Missing required fields');
        return;
      }

      if (message.length > 1000) {
        socket.emit('error', 'Message too long');
        return;
      }
      
      // Store message in Redis
      const messageData = {
        id: Date.now().toString(),
        userId,
        username,
        message,
        timestamp: new Date().toISOString()
      };

      await redis.lpush(`chat:${roomId}`, JSON.stringify(messageData));
      await redis.ltrim(`chat:${roomId}`, 0, 99); // Keep last 100 messages

      // Broadcast message to room
      io.to(roomId).emit('receive_message', messageData);
    } catch (error) {
      console.error('Error handling message:', error);
      socket.emit('error', 'Failed to send message');
    }
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// API endpoint to get chat history
app.get('/api/messages/:roomId', async (req, res) => {
  try {
    const { roomId } = req.params;
    if (!roomId) {
      return res.status(400).json({ error: 'Room ID is required' });
    }

    const messages = await redis.lrange(`chat:${roomId}`, 0, -1);
    const parsedMessages = messages.map(msg => JSON.parse(msg));
    res.json(parsedMessages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

const PORT = process.env.PORT || 3098;

httpServer.listen(PORT, () => {
  console.log(`Chat server running on port ${PORT}`);
}); 