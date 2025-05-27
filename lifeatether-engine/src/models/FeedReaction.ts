import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';
import User from './User';
import Feed from './Feed';

class FeedReaction extends Model {
  public id!: number;
  public feed_id!: number;
  public user_id!: number;
  public reaction_type!: string;
  public readonly created_at!: Date;
}

FeedReaction.init(
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
    reaction_type: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'FeedReaction',
    tableName: 'feed_reactions',
    timestamps: true,
    updatedAt: false,
    underscored: true,
    indexes: [
      {
        unique: true,
        fields: ['feed_id', 'user_id', 'reaction_type'],
      },
    ],
  }
);

FeedReaction.belongsTo(Feed, { foreignKey: 'feed_id', as: 'feed' });
FeedReaction.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

export default FeedReaction; 