import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';
import User from './User';

class Feed extends Model {
  public id!: number;
  public title!: string;
  public content!: string;
  public author_id!: number;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

Feed.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    author_id: {
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
    modelName: 'Feed',
    tableName: 'feeds',
    timestamps: true,
    underscored: true,
  }
);

Feed.belongsTo(User, { foreignKey: 'author_id', as: 'author' });

export default Feed; 