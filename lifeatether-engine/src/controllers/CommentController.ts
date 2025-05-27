import { Request, Response } from 'express';
import { CommentService } from '../services/CommentService';

export class CommentController {
  private commentService: CommentService;

  constructor() {
    this.commentService = new CommentService();
  }

  createComment = async (req: Request, res: Response) => {
    try {
      if (!req.user?.id) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }
      const comment = await this.commentService.createComment({
        ...req.body,
        user_id: req.user.id
      });
      res.status(201).json(comment);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };

  getComment = async (req: Request, res: Response) => {
    try {
      const comment = await this.commentService.findById(Number(req.params.id));
      if (!comment) {
        res.status(404).json({ error: 'Comment not found' });
        return;
      }
      res.json(comment);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };

  getFeedComments = async (req: Request, res: Response) => {
    try {
      const comments = await this.commentService.findByFeedId(Number(req.params.feedId));
      res.json(comments);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };

  updateComment = async (req: Request, res: Response) => {
    try {
      if (!req.user?.id) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }
      const comment = await this.commentService.findById(Number(req.params.id));
      if (!comment) {
        res.status(404).json({ error: 'Comment not found' });
        return;
      }
      if (comment.user_id !== Number(req.user.id)) {
        res.status(403).json({ error: 'Not authorized to update this comment' });
        return;
      }
      const updatedComment = await this.commentService.updateComment(Number(req.params.id), req.body);
      res.json(updatedComment);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };

  deleteComment = async (req: Request, res: Response) => {
    try {
      if (!req.user?.id) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }
      const comment = await this.commentService.findById(Number(req.params.id));
      if (!comment) {
        res.status(404).json({ error: 'Comment not found' });
        return;
      }
      if (comment.user_id !== Number(req.user.id)) {
        res.status(403).json({ error: 'Not authorized to delete this comment' });
        return;
      }
      await this.commentService.deleteComment(Number(req.params.id));
      res.status(204).send();
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };

  getUserComments = async (req: Request, res: Response) => {
    try {
      const comments = await this.commentService.findByUserId(Number(req.params.userId));
      res.json(comments);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };

  searchComments = async (req: Request, res: Response) => {
    try {
      const comments = await this.commentService.searchComments(req.query.q as string);
      res.json(comments);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };
} 