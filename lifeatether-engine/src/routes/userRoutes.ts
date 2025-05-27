import { Router } from 'express';
import { UserController } from '../controllers/UserController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { validateRequest } from '../middlewares/validateRequest';
import { body } from 'express-validator';

const router = Router();
const userController = new UserController();

// Validation middleware
const registerValidation = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
];

const loginValidation = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
];

// Public routes
router.post('/register', registerValidation, validateRequest, userController.register);
router.post('/login', loginValidation, validateRequest, userController.login);

// Protected routes
router.get('/profile', authMiddleware, userController.getProfile);
router.put('/profile', authMiddleware, userController.updateProfile);
router.get('/search', authMiddleware, userController.searchUsers);

export default router; 