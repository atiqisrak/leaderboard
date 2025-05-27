import CommentReaction from '../models/CommentReaction';
import sequelize from '../config/database';

export class CommentReactionService {
  async createReaction(reactionData: {
    comment_id: number;
    user_id: number;
    reaction_type: string;
  }) {
    return CommentReaction.create(reactionData);
  }

  async removeReaction(commentId: number, userId: number, reactionType: string) {
    return CommentReaction.destroy({
      where: {
        comment_id: commentId,
        user_id: userId,
        reaction_type: reactionType
      }
    });
  }

  async getCommentReactions(commentId: number) {
    return CommentReaction.findAll({
      where: { comment_id: commentId },
      include: [{
        association: 'user',
        attributes: { exclude: ['password'] }
      }]
    });
  }

  async getUserReactions(userId: number) {
    return CommentReaction.findAll({
      where: { user_id: userId },
      include: [{
        association: 'comment'
      }]
    });
  }

  async getReactionCounts(commentId: number) {
    const reactions = await CommentReaction.findAll({
      where: { comment_id: commentId },
      attributes: [
        'reaction_type',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      group: ['reaction_type']
    });
    return reactions;
  }
} 