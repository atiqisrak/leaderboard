import { Router } from 'express';
import { FeedController } from '../controllers/FeedController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { validateRequest } from '../middlewares/validateRequest';
import { body } from 'express-validator';

const router = Router();
const feedController = new FeedController();

// Validation middleware
const feedValidation = [
  body('title').notEmpty().withMessage('Title is required')
    .isLength({ max: 255 }).withMessage('Title must be less than 255 characters'),
  body('content').notEmpty().withMessage('Content is required'),
];

// Public routes
router.get('/', feedController.getAllFeeds);
router.get('/search', feedController.searchFeeds);
router.get('/author/:authorId', feedController.getFeedsByAuthor);
router.get('/:id', feedController.getFeed);

// Protected routes
router.post('/', authMiddleware, feedValidation, validateRequest, feedController.createFeed);
router.put('/:id', authMiddleware, feedValidation, validateRequest, feedController.updateFeed);
router.delete('/:id', authMiddleware, feedController.deleteFeed);

export default router; 