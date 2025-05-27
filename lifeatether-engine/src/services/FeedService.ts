import Feed from '../models/Feed';
import User from '../models/User';
import Comment from '../models/Comment';
import { Op } from 'sequelize';

export class FeedService {
  async createFeed(feedData: {
    title: string;
    content: string;
    author_id: number;
  }) {
    return Feed.create(feedData);
  }

  async findById(id: number) {
    return Feed.findByPk(id, {
      include: [
        { model: User, as: 'author' },
        {
          model: Comment,
          as: 'comments',
          include: [{ model: User, as: 'user' }]
        }
      ]
    });
  }

  async updateFeed(id: number, feedData: Partial<Feed>) {
    const feed = await Feed.findByPk(id);
    if (!feed) throw new Error('Feed not found');
    return feed.update(feedData);
  }

  async deleteFeed(id: number) {
    const feed = await Feed.findByPk(id);
    if (!feed) throw new Error('Feed not found');
    return feed.destroy();
  }

  async listFeeds(page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    return Feed.findAndCountAll({
      include: [{ model: User, as: 'author' }],
      order: [['created_at', 'DESC']],
      limit,
      offset
    });
  }

  async searchFeeds(query: string) {
    return Feed.findAll({
      where: {
        [Op.or]: [
          { title: { [Op.iLike]: `%${query}%` } },
          { content: { [Op.iLike]: `%${query}%` } }
        ]
      },
      include: [{ model: User, as: 'author' }]
    });
  }
} 