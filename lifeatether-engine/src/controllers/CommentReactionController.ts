import { Request, Response } from 'express';
import { CommentReactionService } from '../services/CommentReactionService';

export class CommentReactionController {
  private commentReactionService: CommentReactionService;

  constructor() {
    this.commentReactionService = new CommentReactionService();
  }

  addReaction = async (req: Request, res: Response) => {
    try {
      if (!req.user?.id) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }
      const reaction = await this.commentReactionService.createReaction({
        ...req.body,
        user_id: req.user.id
      });
      res.status(201).json(reaction);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };

  removeReaction = async (req: Request, res: Response) => {
    try {
      if (!req.user?.id) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }
      const { commentId, reactionType } = req.params;
      await this.commentReactionService.removeReaction(
        Number(commentId),
        Number(req.user.id),
        reactionType
      );
      res.status(204).send();
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };

  getCommentReactions = async (req: Request, res: Response) => {
    try {
      const reactions = await this.commentReactionService.getCommentReactions(Number(req.params.commentId));
      res.json(reactions);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };

  getUserReactions = async (req: Request, res: Response) => {
    try {
      const reactions = await this.commentReactionService.getUserReactions(Number(req.params.userId));
      res.json(reactions);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };

  getReactionCounts = async (req: Request, res: Response) => {
    try {
      const counts = await this.commentReactionService.getReactionCounts(Number(req.params.commentId));
      res.json(counts);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };
} 