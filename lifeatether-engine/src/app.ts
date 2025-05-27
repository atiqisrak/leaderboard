import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config } from './config/config';
import sequelize from './config/database';
import userRoutes from './routes/userRoutes';
import feedRoutes from './routes/feedRoutes';
import commentRoutes from './routes/commentRoutes';
import feedReactionRoutes from './routes/feedReactionRoutes';
import commentReactionRoutes from './routes/commentReactionRoutes';

const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
  
// Database connection
sequelize.authenticate()
  .then(() => {
    console.log('Database connection has been established successfully.');
  })
  .catch((error) => {
    console.error('Unable to connect to the database:', error);
  });

// API Routes
app.use(`${config.api.prefix}/users`, userRoutes);
app.use(`${config.api.prefix}/feeds`, feedRoutes);
app.use(`${config.api.prefix}/comments`, commentRoutes);
app.use(`${config.api.prefix}/feed-reactions`, feedReactionRoutes);
app.use(`${config.api.prefix}/comment-reactions`, commentReactionRoutes);


// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    status: 'error',
    message: 'Something went wrong!'
  });
});

app.listen(config.port, () => {
  console.log(`Server is running in ${config.nodeEnv} mode on port ${config.port}`);
}); 