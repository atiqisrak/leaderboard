import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';
import User from './User';
import Comment from './Comment';

class CommentMention extends Model {
  public id!: number;
  public comment_id!: number;
  public mentioned_user_id!: number;
  public readonly created_at!: Date;
}

CommentMention.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    comment_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'comments',
        key: 'id',
      },
    },
    mentioned_user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
  },
  {
    sequelize,
    modelName: 'CommentMention',
    tableName: 'comment_mentions',
    timestamps: true,
    updatedAt: false,
    underscored: true,
    indexes: [
      {
        unique: true,
        fields: ['comment_id', 'mentioned_user_id'],
      },
    ],
  }
);

CommentMention.belongsTo(Comment, { foreignKey: 'comment_id', as: 'comment' });
CommentMention.belongsTo(User, { foreignKey: 'mentioned_user_id', as: 'mentionedUser' });

export default CommentMention; 