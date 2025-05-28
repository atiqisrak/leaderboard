import express from "express";
import { CommentReactionController } from "../controllers/CommentReactionController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { validateReactionType } from "../middlewares/validationMiddleware";

const router = express.Router();
const commentReactionController = new CommentReactionController();

// Public routes
router.get("/comment/:commentId", commentReactionController.getCommentReactions);
router.get("/user/:userId", commentReactionController.getUserReactions);
router.get("/comment/:commentId/counts", commentReactionController.getReactionCounts);

// Protected routes
router.post("/", authMiddleware, validateReactionType, commentReactionController.addReaction);
router.put("/:commentId", authMiddleware, validateReactionType, commentReactionController.updateReaction);
router.delete("/:commentId/:reactionType", authMiddleware, commentReactionController.removeReaction);

export default router; 