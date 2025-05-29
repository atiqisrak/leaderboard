import FeedReaction from '../models/FeedReaction';
import sequelize from '../config/database';
import { QueryTypes } from 'sequelize';

export class FeedReactionService {
  async createOrUpdateReaction(reactionData: {
    feed_id: number;
    user_id: number;
    reaction_type: string;
  }) {
    const existingReaction = await FeedReaction.findOne({
      where: {
        feed_id: reactionData.feed_id,
        user_id: reactionData.user_id
      }
    });

    if (existingReaction) {
      // Update existing reaction
      await existingReaction.update({ reaction_type: reactionData.reaction_type });
      return existingReaction;
    }

    // Create new reaction
    return FeedReaction.create(reactionData);
  }

  async removeReaction(feedId: number, userId: number) {
    return FeedReaction.destroy({
      where: {
        feed_id: feedId,
        user_id: userId
      }
    });
  }

  async getFeedReactions(feedId: number, includeUserDetails: boolean = false) {
    const include = includeUserDetails ? [{
      association: 'user',
      attributes: { exclude: ['password'] }
    }] : [];
    
    return FeedReaction.findAll({
      where: { feed_id: feedId },
      include
    });
  }

  async getUserReactions(userId: number) {
    return FeedReaction.findAll({
      where: { user_id: userId },
      include: [{
        association: 'feed'
      }]
    });
  }

  async getReactionCounts(feedId: number) {    
    // First, get all reactions for the feed
    const allReactions = await FeedReaction.findAll({
      where: { feed_id: feedId },
      order: [['created_at', 'DESC']]
    });

    // Get only the latest reaction for each user
    const latestReactions = allReactions.reduce<FeedReaction[]>((acc, reaction) => {
      const existingReaction = acc.find(r => r.user_id === reaction.user_id);
      if (!existingReaction) {
        acc.push(reaction);
      }
      return acc;
    }, []);

    // Count reactions by type
    const counts = latestReactions.reduce<Record<string, number>>((acc, reaction) => {
      acc[reaction.reaction_type] = (acc[reaction.reaction_type] || 0) + 1;
      return acc;
    }, {});

    // Convert to array format
    const result = Object.entries(counts).map(([reaction_type, count]) => ({
      reaction_type,
      count: count.toString()
    }));
    return result;
  }

  async getUserReactionForFeed(feedId: number, userId: number) {
    return FeedReaction.findOne({
      where: {
        feed_id: feedId,
        user_id: userId
      }
    });
  }
} 