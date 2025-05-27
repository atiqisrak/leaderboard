import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';
import User from './User';
import Feed from './Feed';

class Comment extends Model {
  public id!: number;
  public feed_id!: number;
  public user_id!: number;
  public parent_comment_id?: number;
  public content!: string;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

Comment.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    feed_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'feeds',
        key: 'id',
      },
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    parent_comment_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'comments',
        key: 'id',
      },
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Comment',
    tableName: 'comments',
    timestamps: true,
    underscored: true,
  }
);

// Self-referential association for nested comments
Comment.belongsTo(Comment, { foreignKey: 'parent_comment_id', as: 'parent' });
Comment.hasMany(Comment, { foreignKey: 'parent_comment_id', as: 'replies' });

// Associations with Feed and User
Comment.belongsTo(Feed, { foreignKey: 'feed_id', as: 'feed' });
Comment.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

export default Comment; 