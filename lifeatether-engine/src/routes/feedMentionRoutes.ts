import { Router } from 'express';
import { FeedMentionController } from '../controllers/FeedMentionController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { validateRequest } from '../middlewares/validateRequest';
import { body } from 'express-validator';

const router = Router();
const feedMentionController = new FeedMentionController();

// Validation middleware
const mentionValidation = [
  body('feed_id').isInt().withMessage('Valid feed ID is required'),
  body('mentioned_user_id').isInt().withMessage('Valid mentioned user ID is required')
];

// Public routes
router.get('/feed/:feedId', feedMentionController.getFeedMentions);
router.get('/user/:userId', feedMentionController.getUserMentions);
router.get('/feed/:feedId/count', feedMentionController.getMentionCount);

// Protected routes
router.post('/', authMiddleware, mentionValidation, validateRequest, feedMentionController.addMention);
router.delete('/:feedId/:mentionedUserId', authMiddleware, feedMentionController.removeMention);

export default router; 