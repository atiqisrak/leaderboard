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
router.get('/feed/:feedId', feedReactionController.getFeedReactions);
router.get('/user/:userId', feedReactionController.getUserReactions);
router.get('/feed/:feedId/counts', feedReactionController.getReactionCounts);

// Protected routes
router.post('/', authMiddleware, reactionValidation, validateRequest, feedReactionController.addReaction);
router.delete('/:feedId/:reactionType', authMiddleware, feedReactionController.removeReaction);

export default router; 