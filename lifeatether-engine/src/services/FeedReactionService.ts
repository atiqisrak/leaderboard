import FeedReaction from '../models/FeedReaction';
import sequelize from '../config/database';

export class FeedReactionService {
  async createReaction(reactionData: {
    feed_id: number;
    user_id: number;
    reaction_type: string;
  }) {
    return FeedReaction.create(reactionData);
  }

  async removeReaction(feedId: number, userId: number, reactionType: string) {
    return FeedReaction.destroy({
      where: {
        feed_id: feedId,
        user_id: userId,
        reaction_type: reactionType
      }
    });
  }

  async getFeedReactions(feedId: number) {
    return FeedReaction.findAll({
      where: { feed_id: feedId },
      include: [{
        association: 'user',
        attributes: { exclude: ['password'] }
      }]
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
    const reactions = await FeedReaction.findAll({
      where: { feed_id: feedId },
      attributes: [
        'reaction_type',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      group: ['reaction_type']
    });
    return reactions;
  }
} 