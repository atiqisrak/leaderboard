import User from '../models/User';
import { Op } from 'sequelize';

export class UserService {
  async createUser(userData: {
    name: string;
    email: string;
    password: string;
    role?: string;
    avatar?: string;
  }) {
    return User.create(userData);
  }

  async findById(id: number) {
    return User.findByPk(id);
  }

  async findByEmail(email: string) {
    return User.findOne({ where: { email } });
  }

  async updateUser(id: number, userData: Partial<User>) {
    const user = await User.findByPk(id);
    if (!user) throw new Error('User not found');
    return user.update(userData);
  }

  async deleteUser(id: number) {
    const user = await User.findByPk(id);
    if (!user) throw new Error('User not found');
    return user.destroy();
  }

  async searchUsers(query: string) {
    return User.findAll({
      where: {
        [Op.or]: [
          { name: { [Op.iLike]: `%${query}%` } },
          { email: { [Op.iLike]: `%${query}%` } }
        ]
      }
    });
  }
} 