import { Router } from 'express';
import { DashboardController } from '../controllers/DashboardController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();
const dashboardController = new DashboardController();

// All dashboard routes require authentication
router.use(authMiddleware);

// Overall metrics
router.get('/metrics', dashboardController.getOverallMetrics);

// Top users and feeds
router.get('/top-users', dashboardController.getTopUsers);
router.get('/top-feeds', dashboardController.getTopFeeds);

// Activity trends
router.get('/activity-trends', dashboardController.getActivityTrends);

// User engagement metrics
router.get('/user/:userId/engagement', dashboardController.getUserEngagementMetrics);

// Content insights
router.get('/content-insights', dashboardController.getContentInsights);

export default router; 