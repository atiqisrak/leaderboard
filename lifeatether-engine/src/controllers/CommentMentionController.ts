import { Request, Response } from 'express';
import { CommentMentionService } from '../services/CommentMentionService';

export class CommentMentionController {
  private commentMentionService: CommentMentionService;

  constructor() {
    this.commentMentionService = new CommentMentionService();
  }

  addMention = async (req: Request, res: Response) => {
    try {
      if (!req.user?.id) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }
      const mention = await this.commentMentionService.createMention({
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
      const { commentId, mentionedUserId } = req.params;
      await this.commentMentionService.removeMention(
        Number(commentId),
        Number(mentionedUserId)
      );
      res.status(204).send();
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };

  getCommentMentions = async (req: Request, res: Response) => {
    try {
      const mentions = await this.commentMentionService.getCommentMentions(Number(req.params.commentId));
      res.json(mentions);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };

  getUserMentions = async (req: Request, res: Response) => {
    try {
      const mentions = await this.commentMentionService.getUserMentions(Number(req.params.userId));
      res.json(mentions);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };

  getMentionCount = async (req: Request, res: Response) => {
    try {
      const count = await this.commentMentionService.getMentionCount(Number(req.params.commentId));
      res.json({ count });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };
} 