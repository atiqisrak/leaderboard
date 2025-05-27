import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';
import User from './User';
import Feed from './Feed';

class FeedMention extends Model {
  public id!: number;
  public feed_id!: number;
  public mentioned_user_id!: number;
  public readonly created_at!: Date;
}

FeedMention.init(
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
    modelName: 'FeedMention',
    tableName: 'feed_mentions',
    timestamps: true,
    updatedAt: false,
    underscored: true,
    indexes: [
      {
        unique: true,
        fields: ['feed_id', 'mentioned_user_id'],
      },
    ],
  }
);

FeedMention.belongsTo(Feed, { foreignKey: 'feed_id', as: 'feed' });
FeedMention.belongsTo(User, { foreignKey: 'mentioned_user_id', as: 'mentionedUser' });

export default FeedMention; 