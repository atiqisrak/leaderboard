import { Request, Response } from 'express';
import { FeedReactionService } from '../services/FeedReactionService';

export class FeedReactionController {
  private feedReactionService: FeedReactionService;

  constructor() {
    this.feedReactionService = new FeedReactionService();
  }

  addReaction = async (req: Request, res: Response) => {
    try {
      if (!req.user?.id) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }
      const reaction = await this.feedReactionService.createReaction({
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
      const { feedId, reactionType } = req.params;
      await this.feedReactionService.removeReaction(
        Number(feedId),
        Number(req.user.id),
        reactionType
      );
      res.status(204).send();
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };

  getFeedReactions = async (req: Request, res: Response) => {
    try {
      const reactions = await this.feedReactionService.getFeedReactions(Number(req.params.feedId));
      res.json(reactions);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };

  getUserReactions = async (req: Request, res: Response) => {
    try {
      const reactions = await this.feedReactionService.getUserReactions(Number(req.params.userId));
      res.json(reactions);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };

  getReactionCounts = async (req: Request, res: Response) => {
    try {
      const counts = await this.feedReactionService.getReactionCounts(Number(req.params.feedId));
      res.json(counts);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };
} 