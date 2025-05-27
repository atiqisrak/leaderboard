import { Request, Response } from 'express';
import { FeedMentionService } from '../services/FeedMentionService';

export class FeedMentionController {
  private feedMentionService: FeedMentionService;

  constructor() {
    this.feedMentionService = new FeedMentionService();
  }

  addMention = async (req: Request, res: Response) => {
    try {
      if (!req.user?.id) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }
      const mention = await this.feedMentionService.createMention({
        ...req.body,
        mentioned_user_id: req.body.mentioned_user_id
      });
      res.status(201).json(mention);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };

  removeMention = async (req: Request, res: Response) => {
    try {
      if (!req.user?.id) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }
      const { feedId, mentionedUserId } = req.params;
      await this.feedMentionService.removeMention(
        Number(feedId),
        Number(mentionedUserId)
      );
      res.status(204).send();
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };

  getFeedMentions = async (req: Request, res: Response) => {
    try {
      const mentions = await this.feedMentionService.getFeedMentions(Number(req.params.feedId));
      res.json(mentions);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };

  getUserMentions = async (req: Request, res: Response) => {
    try {
      const mentions = await this.feedMentionService.getUserMentions(Number(req.params.userId));
      res.json(mentions);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };

  getMentionCount = async (req: Request, res: Response) => {
    try {
      const count = await this.feedMentionService.getMentionCount(Number(req.params.feedId));
      res.json({ count });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };
} 