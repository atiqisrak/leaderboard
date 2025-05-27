import { Router } from 'express';
import { CommentReactionController } from '../controllers/CommentReactionController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { validateRequest } from '../middlewares/validateRequest';
import { body } from 'express-validator';

const router = Router();
const commentReactionController = new CommentReactionController();

// Validation middleware
const reactionValidation = [
  body('comment_id').isInt().withMessage('Valid comment ID is required'),
  body('reaction_type').isString().withMessage('Reaction type is required')
];

// Public routes
router.get('/comment/:commentId', commentReactionController.getCommentReactions);
router.get('/user/:userId', commentReactionController.getUserReactions);
router.get('/comment/:commentId/counts', commentReactionController.getReactionCounts);

// Protected routes
router.post('/', authMiddleware, reactionValidation, validateRequest, commentReactionController.addReaction);
router.delete('/:commentId/:reactionType', authMiddleware, commentReactionController.removeReaction);

export default router; 