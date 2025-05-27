import { Request, Response } from 'express';
import { FeedService } from '../services/FeedService';

export class FeedController {
  private feedService: FeedService;

  constructor() {
    this.feedService = new FeedService();
  }

  createFeed = async (req: Request, res: Response) => {
    try {
      if (!req.user?.id) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }
      const feed = await this.feedService.createFeed({
        ...req.body,
        author_id: req.user.id
      });
      res.status(201).json(feed);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };

  getFeed = async (req: Request, res: Response) => {
    try {
      const feed = await this.feedService.findById(Number(req.params.id));
      if (!feed) {
        res.status(404).json({ error: 'Feed not found' });
        return;
      }
      res.json(feed);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };

  getAllFeeds = async (req: Request, res: Response) => {
    try {
      const feeds = await this.feedService.findAll();
      res.json(feeds);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };

  updateFeed = async (req: Request, res: Response) => {
    try {
      if (!req.user?.id) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }
      const feed = await this.feedService.findById(Number(req.params.id));
      if (!feed) {
        res.status(404).json({ error: 'Feed not found' });
        return;
      }
      if (feed.author_id !== Number(req.user.id)) {
        res.status(403).json({ error: 'Not authorized to update this feed' });
        return;
      }
      const updatedFeed = await this.feedService.updateFeed(Number(req.params.id), req.body);
      res.json(updatedFeed);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };

  deleteFeed = async (req: Request, res: Response) => {
    try {
      if (!req.user?.id) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }
      const feed = await this.feedService.findById(Number(req.params.id));
      if (!feed) {
        res.status(404).json({ error: 'Feed not found' });
        return;
      }
      if (feed.author_id !== Number(req.user.id)) {
        res.status(403).json({ error: 'Not authorized to delete this feed' });
        return;
      }
      await this.feedService.deleteFeed(Number(req.params.id));
      res.status(204).send();
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };

  searchFeeds = async (req: Request, res: Response) => {
    try {
      const feeds = await this.feedService.searchFeeds(req.query.q as string);
      res.json(feeds);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };

  getFeedsByAuthor = async (req: Request, res: Response) => {
    try {
      const feeds = await this.feedService.findByAuthor(Number(req.params.authorId));
      res.json(feeds);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };
} 