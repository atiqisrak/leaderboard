import { Router } from 'express';
import { CommentMentionController } from '../controllers/CommentMentionController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { validateRequest } from '../middlewares/validateRequest';
import { body } from 'express-validator';

const router = Router();
const commentMentionController = new CommentMentionController();

// Validation middleware
const mentionValidation = [
  body('comment_id').isInt().withMessage('Valid comment ID is required'),
  body('mentioned_user_id').isInt().withMessage('Valid mentioned user ID is required')
];

// Public routes
router.get('/comment/:commentId', commentMentionController.getCommentMentions);
router.get('/user/:userId', commentMentionController.getUserMentions);
router.get('/comment/:commentId/count', commentMentionController.getMentionCount);

// Protected routes
router.post('/', authMiddleware, mentionValidation, validateRequest, commentMentionController.addMention);
router.delete('/:commentId/:mentionedUserId', authMiddleware, commentMentionController.removeMention);

export default router; 