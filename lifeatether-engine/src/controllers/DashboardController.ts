import { Request, Response } from 'express';
import { DashboardService } from '../services/DashboardService';

export class DashboardController {
  private dashboardService: DashboardService;

  constructor() {
    this.dashboardService = new DashboardService();
  }

  renderDashboard = async (req: Request, res: Response) => {
    try {
      const [
        overallMetrics,
        topUsers,
        topFeeds,
        activityTrends,
        contentInsights
      ] = await Promise.all([
        this.dashboardService.getOverallMetrics(),
        this.dashboardService.getTopUsers(5),
        this.dashboardService.getTopFeeds(5),
        this.dashboardService.getActivityTrends(7),
        this.dashboardService.getContentInsights()
      ]);

      res.render('dashboard', {
        overallMetrics,
        topUsers,
        topFeeds,
        activityTrends,
        contentInsights
      });
    } catch (error: any) {
      res.status(500).render('error', { error: error.message });
    }
  };

  getOverallMetrics = async (req: Request, res: Response) => {
    try {
      const metrics = await this.dashboardService.getOverallMetrics();
      res.json(metrics);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };

  getTopUsers = async (req: Request, res: Response) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const users = await this.dashboardService.getTopUsers(limit);
      res.json(users);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };

  getTopFeeds = async (req: Request, res: Response) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const feeds = await this.dashboardService.getTopFeeds(limit);
      res.json(feeds);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };

  getActivityTrends = async (req: Request, res: Response) => {
    try {
      const days = req.query.days ? parseInt(req.query.days as string) : 30;
      const trends = await this.dashboardService.getActivityTrends(days);
      res.json(trends);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };

  getUserEngagementMetrics = async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.userId);
      if (isNaN(userId)) {
        res.status(400).json({ error: 'Invalid user ID' });
        return;
      }
      const metrics = await this.dashboardService.getUserEngagementMetrics(userId);
      res.json(metrics);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };

  getContentInsights = async (req: Request, res: Response) => {
    try {
      const insights = await this.dashboardService.getContentInsights();
      res.json(insights);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };
} 