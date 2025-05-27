import { Router } from 'express';
import { CommentController } from '../controllers/CommentController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { validateRequest } from '../middlewares/validateRequest';
import { body } from 'express-validator';

const router = Router();
const commentController = new CommentController();

// Validation middleware
const commentValidation = [
  body('content').notEmpty().withMessage('Content is required'),
  body('feed_id').isInt().withMessage('Valid feed ID is required'),
  body('parent_comment_id')
    .optional()
    .isInt()
    .withMessage('If provided, parent comment ID must be a valid integer')
];

// Public routes
router.get('/feed/:feedId', commentController.getFeedComments);
router.get('/user/:userId', commentController.getUserComments);
router.get('/search', commentController.searchComments);
router.get('/:id', commentController.getComment);

// Protected routes
router.post('/', authMiddleware, commentValidation, validateRequest, commentController.createComment);
router.put('/:id', authMiddleware, commentValidation, validateRequest, commentController.updateComment);
router.delete('/:id', authMiddleware, commentController.deleteComment);

export default router; 