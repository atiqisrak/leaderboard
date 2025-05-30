import dotenv from 'dotenv';
import { Secret } from 'jsonwebtoken';

dotenv.config();

export const config = {
  port: process.env.PORT || 3096,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // JWT
  jwt: {
    secret: (process.env.JWT_SECRET || 'your-super-secret-jwt-key') as Secret,
    expiresIn: process.env.JWT_EXPIRES_IN || '24h',
  },
  
  // Engine API
  engine: {
    url: process.env.ENGINE_URL || 'http://localhost:3098',
    apiPrefix: '/api/v1',
  }
}; 