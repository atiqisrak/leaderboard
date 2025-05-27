import dotenv from 'dotenv';
import { Secret } from 'jsonwebtoken';

dotenv.config();

export const config = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // Database
  db: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    name: process.env.DB_NAME || 'lifeatether',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
  },
  
  // JWT
  jwt: {
    secret: (process.env.JWT_SECRET || 'your-super-secret-jwt-key') as Secret,
    expiresIn: process.env.JWT_EXPIRES_IN || '24h',
  },
  
  // API
  api: {
    prefix: '/api/v1',
  }
}; 