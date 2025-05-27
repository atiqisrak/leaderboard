import Feed from '../models/Feed';
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
      include: [{
        association: 'author',
        attributes: { exclude: ['password'] }
      }]
    });
  }

  async findAll() {
    return Feed.findAll({
      include: [{
        association: 'author',
        attributes: { exclude: ['password'] }
      }],
      order: [['created_at', 'DESC']]
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

  async searchFeeds(query: string) {
    return Feed.findAll({
      where: {
        [Op.or]: [
          { title: { [Op.iLike]: `%${query}%` } },
          { content: { [Op.iLike]: `%${query}%` } }
        ]
      },
      include: [{
        association: 'author',
        attributes: { exclude: ['password'] }
      }],
      order: [['created_at', 'DESC']]
    });
  }

  async findByAuthor(authorId: number) {
    return Feed.findAll({
      where: { author_id: authorId },
      include: [{
        association: 'author',
        attributes: { exclude: ['password'] }
      }],
      order: [['created_at', 'DESC']]
    });
  }
} 