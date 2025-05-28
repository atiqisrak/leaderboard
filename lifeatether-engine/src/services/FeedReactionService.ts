import FeedReaction from '../models/FeedReaction';
import sequelize from '../config/database';

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
    interface ReactionCount {
      reaction_type: string;
      count: string;
    }

    const reactions = await FeedReaction.findAll({
      where: { feed_id: feedId },
      attributes: [
        'reaction_type',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      group: ['reaction_type'],
      raw: true
    }) as unknown as ReactionCount[];
    
    // Transform the data to ensure count is a number
    return reactions.map(reaction => ({
      reaction_type: reaction.reaction_type,
      count: parseInt(reaction.count)
    }));
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