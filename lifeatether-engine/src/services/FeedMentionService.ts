import FeedMention from '../models/FeedMention';

export class FeedMentionService {
  async createMention(mentionData: {
    feed_id: number;
    mentioned_user_id: number;
  }) {
    return FeedMention.create(mentionData);
  }

  async removeMention(feedId: number, mentionedUserId: number) {
    return FeedMention.destroy({
      where: {
        feed_id: feedId,
        mentioned_user_id: mentionedUserId
      }
    });
  }

  async getFeedMentions(feedId: number) {
    return FeedMention.findAll({
      where: { feed_id: feedId },
      include: [{
        association: 'mentionedUser',
        attributes: { exclude: ['password'] }
      }]
    });
  }

  async getUserMentions(userId: number) {
    return FeedMention.findAll({
      where: { mentioned_user_id: userId },
      include: [{
        association: 'feed'
      }]
    });
  }

  async getMentionCount(feedId: number) {
    return FeedMention.count({
      where: { feed_id: feedId }
    });
  }
} 