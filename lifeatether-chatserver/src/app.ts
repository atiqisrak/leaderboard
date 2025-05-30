import { createServer } from 'http';
import express from 'express';
import cors from 'cors';
import { setupSocketIO } from './socket';
import { ChatRedisService } from './redis-chat';
import { login } from './auth';
import { config } from './config/config';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const httpServer = createServer(app);

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || ['http://localhost:3000', 'http://localhost:3096', 'http://localhost:3097'],
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 204
}));
app.use(express.json());

// Auth endpoint
app.post('/api/auth/login', login);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// API endpoints
app.post('/api/rooms', async (req, res) => {
  try {
    const { roomId, creatorId } = req.body;
    await ChatRedisService.createRoom(roomId, creatorId);
    res.json({ success: true, roomId });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create room' });
  }
});

app.get('/api/rooms/:roomId/messages', async (req, res) => {
  try {
    const { roomId } = req.params;
    const messages = await ChatRedisService.getMessageHistory(roomId);
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// Initialize Socket.IO with CORS
setupSocketIO(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || ['http://localhost:3000', 'http://localhost:3096', 'http://localhost:3097'],
    methods: ['GET', 'POST', 'OPTIONS'],
    credentials: true,
  }
}).then(() => {
  console.log('Socket.IO initialized');
});

const PORT = config.port;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 