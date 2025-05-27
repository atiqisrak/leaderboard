import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';
import User from './User';
import Comment from './Comment';

class CommentReaction extends Model {
  public id!: number;
  public comment_id!: number;
  public user_id!: number;
  public reaction_type!: string;
  public readonly created_at!: Date;
}

CommentReaction.init(
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
    modelName: 'CommentReaction',
    tableName: 'comment_reactions',
    timestamps: true,
    updatedAt: false,
    underscored: true,
    indexes: [
      {
        unique: true,
        fields: ['comment_id', 'user_id', 'reaction_type'],
      },
    ],
  }
);

CommentReaction.belongsTo(Comment, { foreignKey: 'comment_id', as: 'comment' });
CommentReaction.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

export default CommentReaction; 