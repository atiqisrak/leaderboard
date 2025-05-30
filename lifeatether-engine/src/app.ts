import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { config } from './config/config';
import { errorHandler } from './middlewares/errorHandler';
import { authMiddleware } from './middlewares/authMiddleware';
import { DashboardController } from './controllers/DashboardController';

// Import routes
import userRoutes from './routes/userRoutes';
import feedRoutes from './routes/feedRoutes';
import commentRoutes from './routes/commentRoutes';
import feedMentionRoutes from './routes/feedMentionRoutes';
import commentMentionRoutes from './routes/commentMentionRoutes';
import feedReactionRoutes from './routes/feedReactionRoutes';
import commentReactionRoutes from './routes/commentReactionRoutes';
import dashboardRoutes from './routes/dashboardRoutes';

const app = express();
const dashboardController = new DashboardController();

// Middleware
app.use(cors({
  origin: ['http://0.0.0.0:3099', 'http://0.0.0.0:3098', 'http://127.0.0.1:3099', 'http://188.166.232.67:3099', 'http://localhost:3096', 'http://localhost:3097',
    'http://192.168.102:3097',
  ],
  // origin: '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// View engine setup
app.set('view engine', 'ejs');
app.set('views', './src/views');

// Public directory for static files
app.use(express.static('public'));

// Routes
app.get('/', dashboardController.renderDashboard);

// API routes
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/feeds', feedRoutes);
app.use('/api/v1/comments', commentRoutes);
app.use('/api/v1/feed-mentions', feedMentionRoutes);
app.use('/api/v1/comment-mentions', commentMentionRoutes);
app.use('/api/v1/feed-reactions', feedReactionRoutes);
app.use('/api/v1/comment-reactions', commentReactionRoutes);
app.use('/api/v1/dashboard', authMiddleware, dashboardRoutes);

// Error handling
app.use(errorHandler);

// Start server
const PORT = config.port || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

export default app; 