import Comment from '../models/Comment';
import { Op } from 'sequelize';

export class CommentService {
  async createComment(commentData: {
    feed_id: number;
    user_id: number;
    parent_comment_id?: number;
    content: string;
  }) {
    return Comment.create(commentData);
  }

  async findById(id: number) {
    return Comment.findByPk(id, {
      include: [
        {
          association: 'user',
          attributes: { exclude: ['password'] }
        },
        {
          association: 'replies',
          include: [{
            association: 'user',
            attributes: { exclude: ['password'] }
          }]
        }
      ]
    });
  }

  async findByFeedId(feedId: number) {
    return Comment.findAll({
      where: {
        feed_id: feedId,
        parent_comment_id: null // Only get top-level comments
      },
      include: [
        {
          association: 'user',
          attributes: { exclude: ['password'] }
        },
        {
          association: 'replies',
          include: [{
            association: 'user',
            attributes: { exclude: ['password'] }
          }]
        }
      ],
      order: [
        ['created_at', 'DESC'],
        [Comment.associations.replies, 'created_at', 'ASC']
      ]
    });
  }

  async updateComment(id: number, commentData: Partial<Comment>) {
    const comment = await Comment.findByPk(id);
    if (!comment) throw new Error('Comment not found');
    return comment.update(commentData);
  }

  async deleteComment(id: number) {
    const comment = await Comment.findByPk(id);
    if (!comment) throw new Error('Comment not found');
    return comment.destroy();
  }

  async findByUserId(userId: number) {
    return Comment.findAll({
      where: { user_id: userId },
      include: [
        {
          association: 'user',
          attributes: { exclude: ['password'] }
        },
        {
          association: 'feed'
        }
      ],
      order: [['created_at', 'DESC']]
    });
  }

  async searchComments(query: string) {
    return Comment.findAll({
      where: {
        content: { [Op.iLike]: `%${query}%` }
      },
      include: [
        {
          association: 'user',
          attributes: { exclude: ['password'] }
        },
        {
          association: 'feed'
        }
      ],
      order: [['created_at', 'DESC']]
    });
  }
} 