import User from '../models/User';
import Feed from '../models/Feed';
import Comment from '../models/Comment';
import FeedReaction from '../models/FeedReaction';
import CommentReaction from '../models/CommentReaction';
import FeedMention from '../models/FeedMention';
import CommentMention from '../models/CommentMention';
import { Op } from 'sequelize';
import sequelize from '../config/database';

export class DashboardService {
  async getOverallMetrics() {
    const [
      totalUsers,
      totalFeeds,
      totalComments,
      totalFeedReactions,
      totalCommentReactions,
      totalFeedMentions,
      totalCommentMentions
    ] = await Promise.all([
      User.count(),
      Feed.count(),
      Comment.count(),
      FeedReaction.count(),
      CommentReaction.count(),
      FeedMention.count(),
      CommentMention.count()
    ]);

    return {
      totalUsers,
      totalFeeds,
      totalComments,
      totalFeedReactions,
      totalCommentReactions,
      totalFeedMentions,
      totalCommentMentions,
      averageFeedsPerUser: totalUsers > 0 ? (totalFeeds / totalUsers).toFixed(2) : 0,
      averageCommentsPerFeed: totalFeeds > 0 ? (totalComments / totalFeeds).toFixed(2) : 0,
      averageReactionsPerFeed: totalFeeds > 0 ? (totalFeedReactions / totalFeeds).toFixed(2) : 0,
      averageReactionsPerComment: totalComments > 0 ? (totalCommentReactions / totalComments).toFixed(2) : 0
    };
  }

  async getTopUsers(limit: number = 10) {
    const topUsers = await User.findAll({
      attributes: [
        'id',
        'name',
        'email',
        'avatar',
        'role',
        'created_at',
        'updated_at',
        [
          sequelize.literal('(SELECT COUNT(*) FROM feeds WHERE feeds.author_id = "User".id)'),
          'feedCount'
        ],
        [
          sequelize.literal('(SELECT COUNT(*) FROM comments WHERE comments.user_id = "User".id)'),
          'commentCount'
        ],
        [
          sequelize.literal('(SELECT COUNT(*) FROM feed_reactions WHERE feed_reactions.user_id = "User".id)'),
          'reactionCount'
        ]
      ],
      order: [[sequelize.literal('"feedCount"'), 'DESC']],
      limit
    });

    return topUsers;
  }

  async getTopFeeds(limit: number = 10) {
    const topFeeds = await Feed.findAll({
      attributes: [
        'id',
        'title',
        'content',
        'author_id',
        'created_at',
        'updated_at',
        [
          sequelize.literal(`(
            SELECT COUNT(*) FROM comments WHERE feed_id = "Feed".id
          )`),
          'commentCount'
        ],
        [
          sequelize.literal(`(
            SELECT COUNT(*) FROM feed_reactions WHERE feed_id = "Feed".id
          )`),
          'reactionCount'
        ],
        [
          sequelize.literal(`(
            SELECT COUNT(*) FROM feed_mentions WHERE feed_id = "Feed".id
          )`),
          'mentionCount'
        ]
      ],
      include: [{
        model: User,
        as: 'author',
        attributes: ['id', 'name', 'avatar']
      }],
      order: [[sequelize.literal('"reactionCount"'), 'DESC']],
      limit
    });

    return topFeeds;
  }

  async getActivityTrends(days: number = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const [feedTrends, commentTrends, reactionTrends] = await Promise.all([
      Feed.findAll({
        attributes: [
          [sequelize.fn('DATE', sequelize.col('created_at')), 'date'],
          [sequelize.fn('COUNT', '*'), 'count']
        ],
        where: {
          created_at: {
            [Op.gte]: startDate
          }
        },
        group: [sequelize.fn('DATE', sequelize.col('created_at'))],
        order: [[sequelize.fn('DATE', sequelize.col('created_at')), 'ASC']]
      }),
      Comment.findAll({
        attributes: [
          [sequelize.fn('DATE', sequelize.col('created_at')), 'date'],
          [sequelize.fn('COUNT', '*'), 'count']
        ],
        where: {
          created_at: {
            [Op.gte]: startDate
          }
        },
        group: [sequelize.fn('DATE', sequelize.col('created_at'))],
        order: [[sequelize.fn('DATE', sequelize.col('created_at')), 'ASC']]
      }),
      FeedReaction.findAll({
        attributes: [
          [sequelize.fn('DATE', sequelize.col('created_at')), 'date'],
          [sequelize.fn('COUNT', '*'), 'count']
        ],
        where: {
          created_at: {
            [Op.gte]: startDate
          }
        },
        group: [sequelize.fn('DATE', sequelize.col('created_at'))],
        order: [[sequelize.fn('DATE', sequelize.col('created_at')), 'ASC']]
      })
    ]);

    return {
      feedTrends,
      commentTrends,
      reactionTrends
    };
  }

  async getUserEngagementMetrics(userId: number) {
    const [
      feedCount,
      commentCount,
      reactionCount,
      mentionCount,
      averageReactionsPerFeed,
      averageCommentsPerFeed
    ] = await Promise.all([
      Feed.count({ where: { author_id: userId } }),
      Comment.count({ where: { user_id: userId } }),
      FeedReaction.count({ where: { user_id: userId } }),
      FeedMention.count({ where: { mentioned_user_id: userId } }),
      Feed.findAll({
        attributes: [
          [sequelize.fn('AVG', sequelize.literal(`(
            SELECT COUNT(*) FROM feed_reactions WHERE feed_id = "Feed".id
          )`)), 'averageReactions']
        ],
        where: { author_id: userId }
      }),
      Feed.findAll({
        attributes: [
          [sequelize.fn('AVG', sequelize.literal(`(
            SELECT COUNT(*) FROM comments WHERE feed_id = "Feed".id
          )`)), 'averageComments']
        ],
        where: { author_id: userId }
      })
    ]);

    return {
      feedCount,
      commentCount,
      reactionCount,
      mentionCount,
      averageReactionsPerFeed: Math.round(averageReactionsPerFeed[0]?.getDataValue('averageReactions') || 0),
      averageCommentsPerFeed: Math.round(averageCommentsPerFeed[0]?.getDataValue('averageComments') || 0)
    };
  }

  async getContentInsights() {
    const [feedLengthStats, commentLengthStats] = await Promise.all([
      Feed.findAll({
        attributes: [
          [sequelize.fn('AVG', sequelize.fn('LENGTH', sequelize.col('content'))), 'averageLength'],
          [sequelize.fn('MAX', sequelize.fn('LENGTH', sequelize.col('content'))), 'maxLength'],
          [sequelize.fn('MIN', sequelize.fn('LENGTH', sequelize.col('content'))), 'minLength']
        ]
      }),
      Comment.findAll({
        attributes: [
          [sequelize.fn('AVG', sequelize.fn('LENGTH', sequelize.col('content'))), 'averageLength'],
          [sequelize.fn('MAX', sequelize.fn('LENGTH', sequelize.col('content'))), 'maxLength'],
          [sequelize.fn('MIN', sequelize.fn('LENGTH', sequelize.col('content'))), 'minLength']
        ]
      })
    ]);

    return {
      feedLengthStats: {
        averageLength: Math.round(feedLengthStats[0]?.getDataValue('averageLength') || 0),
        maxLength: feedLengthStats[0]?.getDataValue('maxLength') || 0,
        minLength: feedLengthStats[0]?.getDataValue('minLength') || 0
      },
      commentLengthStats: {
        averageLength: Math.round(commentLengthStats[0]?.getDataValue('averageLength') || 0),
        maxLength: commentLengthStats[0]?.getDataValue('maxLength') || 0,
        minLength: commentLengthStats[0]?.getDataValue('minLength') || 0
      }
    };
  }
}