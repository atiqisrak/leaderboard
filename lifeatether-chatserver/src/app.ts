import { createServer } from 'http';
import express, { Request } from 'express';
import cors from 'cors';
import { setupSocketIO } from './socket';
import { ChatRedisService } from './redis-chat';
import { login, verifyToken } from './auth';
import { config } from './config/config';
import dotenv from 'dotenv';
import { JwtPayload } from 'jsonwebtoken';

dotenv.config();

// Extend Express Request type to include user
interface AuthenticatedRequest extends Request {
  user?: JwtPayload & {
    id: string;
    [key: string]: any;
  };
}

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

// Auth middleware
const authMiddleware = (req: AuthenticatedRequest, res: express.Response, next: express.NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader?.startsWith('Bearer ')) {
      res.status(401).json({ error: 'No token provided' });
      return;
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);
    
    if (!decoded) {
      res.status(401).json({ error: 'Invalid token' });
      return;
    }

    req.user = decoded;
    next();
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Auth endpoint
app.post('/api/auth/login', login);

// Health check endpoint
app.get('/health', (_req, res) => {
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

app.get('/api/rooms/:roomId/messages', authMiddleware, async (req, res) => {
  try {
    const { roomId } = req.params;
    const messages = await ChatRedisService.getMessageHistory(roomId);
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

app.get('/api/chats', authMiddleware, async (req: AuthenticatedRequest, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ error: 'User not authenticated' });
    }
    const userId = req.user.id;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const chats = await ChatRedisService.getUserChats(userId, page, limit);
    return res.json(chats);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch chats' });
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