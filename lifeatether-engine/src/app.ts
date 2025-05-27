import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config } from './config/config';
import sequelize from './config/database';
import userRoutes from './routes/userRoutes';

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