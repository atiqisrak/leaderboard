import { Router } from 'express';
import { FeedReactionController } from '../controllers/FeedReactionController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { validateRequest } from '../middlewares/validateRequest';
import { body } from 'express-validator';

const router = Router();
const feedReactionController = new FeedReactionController();

// Validation middleware
const reactionValidation = [
  body('feed_id').isInt().withMessage('Valid feed ID is required'),
  body('reaction_type').isString().withMessage('Reaction type is required')
];

// Public routes
router.get('/feed/:feedId/counts', feedReactionController.getReactionCounts);
router.get('/feed/:feedId', feedReactionController.getFeedReactions);

// Protected routes
router.post('/', authMiddleware, reactionValidation, validateRequest, feedReactionController.addOrUpdateReaction);
router.put('/:feedId', authMiddleware, reactionValidation, validateRequest, feedReactionController.addOrUpdateReaction);
router.delete('/:feedId', authMiddleware, feedReactionController.removeReaction);
router.get('/user/:userId', authMiddleware, feedReactionController.getUserReactions);

export default router; 