import CommentMention from '../models/CommentMention';

export class CommentMentionService {
  async createMention(mentionData: {
    comment_id: number;
    mentioned_user_id: number;
  }) {
    return CommentMention.create(mentionData);
  }

  async removeMention(commentId: number, mentionedUserId: number) {
    return CommentMention.destroy({
      where: {
        comment_id: commentId,
        mentioned_user_id: mentionedUserId
      }
    });
  }

  async getCommentMentions(commentId: number) {
    return CommentMention.findAll({
      where: { comment_id: commentId },
      include: [{
        association: 'mentionedUser',
        attributes: { exclude: ['password'] }
      }]
    });
  }

  async getUserMentions(userId: number) {
    return CommentMention.findAll({
      where: { mentioned_user_id: userId },
      include: [{
        association: 'comment'
      }]
    });
  }

  async getMentionCount(commentId: number) {
    return CommentMention.count({
      where: { comment_id: commentId }
    });
  }
} 