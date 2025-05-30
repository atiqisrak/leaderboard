import jwt, { JwtPayload } from 'jsonwebtoken';
import { Request, Response } from 'express';
import axios from 'axios';
import { config } from './config/config';

const ENGINE_URL = process.env.ENGINE_URL || 'http://localhost:3098';

interface UserPayload extends JwtPayload {
  id: string;
  email?: string;
  [key: string]: any;
}

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Forward login request to the engine
    const response = await axios.post(`${ENGINE_URL}/api/v1/users/login`, {
      email,
      password
    });

    // Return the engine's response (which includes the JWT token)
    res.json(response.data);
  } catch (error: any) {
    if (error.response) {
      // Forward the engine's error response
      res.status(error.response.status).json(error.response.data);
    } else {
      res.status(500).json({ error: 'Failed to connect to authentication service' });
    }
  }
};

export const verifyToken = (token: string): UserPayload | null => {
  try {
    return jwt.verify(token, config.jwt.secret as string) as UserPayload;
  } catch (error) {
    return null;
  }
}; 