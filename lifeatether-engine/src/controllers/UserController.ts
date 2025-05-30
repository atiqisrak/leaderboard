import { Request, Response } from 'express';
import { UserService } from '../services/UserService';
import jwt, { SignOptions, Secret } from 'jsonwebtoken';
import { config } from '../config/config';

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  register = async (req: Request, res: Response) => {
    try {
      const user = await this.userService.createUser(req.body);
      const options: SignOptions = { expiresIn: config.jwt.expiresIn as jwt.SignOptions['expiresIn'] };
      const token = jwt.sign({ id: user.id }, config.jwt.secret as Secret, options);
      res.status(201).json({ user, token });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };

  login = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      const user = await this.userService.findByEmail(email);
      
      if (!user || !(await user.comparePassword(password))) {
        res.status(401).json({ error: 'Invalid credentials' });
        return;
      }

      const options: SignOptions = { expiresIn: config.jwt.expiresIn as jwt.SignOptions['expiresIn'] };
      const token = jwt.sign({ id: user.id }, config.jwt.secret as Secret, options);
      
      console.log('Debug - Generated token:', token);
      console.log('Debug - User data:', user);
      
      // Set cookie with appropriate options
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Only use secure in production
        sameSite: 'lax',
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        path: '/'
      });

      res.json({ user, token });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };

  getProfile = async (req: Request, res: Response) => {
    try {
      if (!req.user?.id) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }
      const user = await this.userService.findById(Number(req.user.id));
      if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
      }
      res.json(user);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };

  getUserById = async (req: Request, res: Response) => {
    try {
      const userId = Number(req.params.id);
      if (isNaN(userId)) {
        res.status(400).json({ error: 'Invalid user ID' });
        return;
      }

      const user = await this.userService.findById(userId);
      if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
      }

      // Only return necessary user information
      const userInfo = {
        id: user.id,
        name: user.name,
        avatar: user.avatar
      };

      res.json(userInfo);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };

  updateProfile = async (req: Request, res: Response) => {
    try {
      if (!req.user?.id) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }
      const user = await this.userService.updateUser(Number(req.user.id), req.body);
      res.json(user);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };

  searchUsers = async (req: Request, res: Response) => {
    try {
      const users = await this.userService.searchUsers(req.query.q as string);
      res.json(users);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };

  getAllUserNames = async (req: Request, res: Response) => {
    try {
      const users = await this.userService.getAllUserNames();
      // Ensure we return only id and name
      const formattedUsers = users.map(user => ({
        id: user.id,
        name: user.name
      }));
      res.json(formattedUsers);
    } catch (error: any) {
      console.error('Error in getAllUserNames:', error);
      res.status(500).json({ error: error.message || 'Failed to fetch users' });
    }
  };
} 