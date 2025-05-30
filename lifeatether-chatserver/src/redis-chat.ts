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

  static async addMessage(roomId: string, message: ChatMessage) {
    // Add message to room's message list
    await redis.lpush(`chat:${roomId}:messages`, JSON.stringify(message));
    await redis.ltrim(`chat:${roomId}:messages`, 0, 999); // Keep last 1000 messages

    // Add room to both users' chat lists
    const [_, user1Id, user2Id] = roomId.split('_');
    await redis.sadd(`user:${user1Id}:chats`, roomId);
    await redis.sadd(`user:${user2Id}:chats`, roomId);

    // Update last message info for both users
    const lastMessageInfo = {
      roomId,
      lastMessage: message.message,
      lastMessageTime: message.timestamp,
      otherUserId: message.userId === user1Id ? user2Id : user1Id
    };

    await redis.hset(`user:${user1Id}:last_messages`, roomId, JSON.stringify(lastMessageInfo));
    await redis.hset(`user:${user2Id}:last_messages`, roomId, JSON.stringify(lastMessageInfo));
  }

  static async getUserChats(userId: string, page: number = 1, limit: number = 20) {
    // Get all rooms where the user has messages
    const lastMessages = await redis.hgetall(`user:${userId}:last_messages`);
    
    if (!lastMessages || Object.keys(lastMessages).length === 0) {
      return {
        chats: [],
        total: 0,
        page,
        limit
      };
    }

    // Convert the hash to an array of chat objects
    const allChats = Object.entries(lastMessages).map(([roomId, messageInfo]) => {
      const info = JSON.parse(messageInfo);
      return {
        roomId,
        userId: info.otherUserId,
        lastMessage: info.lastMessage,
        lastMessageTime: info.lastMessageTime,
        unreadCount: 0 // You can implement unread count tracking if needed
      };
    });

    // Sort by last message time
    const sortedChats = allChats.sort((a, b) => 
      new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime()
    );

    // Calculate pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedChats = sortedChats.slice(startIndex, endIndex);

    return {
      chats: paginatedChats,
      total: sortedChats.length,
      page,
      limit
    };
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