import redis from './index';

export interface ChatMessage {
  id: number;
  userId: string;
  message: string;
  timestamp: string;
}

export class ChatRedisService {
  // Store user session
  static async setUserSession(userId: string, socketId: string) {
    const key = `user:${userId}:session`;
    await redis.set(key, socketId);
    await redis.expire(key, 24 * 60 * 60); // 24 hours expiry
  }

  // Get user session
  static async getUserSession(userId: string) {
    return await redis.get(`user:${userId}:session`);
  }

  // Store online users
  static async addOnlineUser(userId: string) {
    await redis.sadd('online_users', userId);
  }

  static async removeOnlineUser(userId: string) {
    await redis.srem('online_users', userId);
  }

  static async getOnlineUsers() {
    return await redis.smembers('online_users');
  }

  // Message history
  static async getMessageHistory(roomId: string, limit: number = 50) {
    const messages = await redis.lrange(`chat:${roomId}:messages`, 0, limit - 1);
    return messages.map(msg => JSON.parse(msg) as ChatMessage);
  }

  // Rate limiting
  static async checkRateLimit(userId: string, limit: number = 10, window: number = 60) {
    const key = `ratelimit:${userId}`;
    const current = await redis.incr(key);
    
    if (current === 1) {
      await redis.expire(key, window);
    }
    
    return current <= limit;
  }

  // Room management
  static async createRoom(roomId: string, creatorId: string) {
    const roomKey = `room:${roomId}`;
    await redis.hset(roomKey, {
      creator: creatorId,
      createdAt: new Date().toISOString()
    });
  }

  static async addUserToRoom(roomId: string, userId: string) {
    await redis.sadd(`room:${roomId}:users`, userId);
  }

  static async removeUserFromRoom(roomId: string, userId: string) {
    await redis.srem(`room:${roomId}:users`, userId);
  }

  static async getRoomUsers(roomId: string) {
    return await redis.smembers(`room:${roomId}:users`);
  }
} 