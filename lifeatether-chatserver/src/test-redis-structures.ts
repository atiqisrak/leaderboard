import redis from './index';
import { ChatRedisService } from './redis-chat';

async function testRedisStructures() {
  try {
    console.log('🧪 Testing Redis Data Structures...');

    // 1. Test User Session
    const userId = 'user123';
    const socketId = 'socket456';
    await ChatRedisService.setUserSession(userId, socketId);
    const session = await ChatRedisService.getUserSession(userId);
    console.log('✅ User Session:', session);

    // 2. Test Online Users
    await ChatRedisService.addOnlineUser(userId);
    const onlineUsers = await ChatRedisService.getOnlineUsers();
    console.log('✅ Online Users:', onlineUsers);

    // 3. Test Chat Messages
    const roomId = 'room789';
    const message = {
      id: Date.now(),
      userId,
      message: 'Hello Redis!',
      timestamp: new Date().toISOString()
    };
    
    // Store message
    await redis.lpush(`chat:${roomId}:messages`, JSON.stringify(message));
    // Get messages
    const messages = await ChatRedisService.getMessageHistory(roomId);
    console.log('✅ Chat Messages:', messages);

    // 4. Test Rate Limiting
    const isAllowed = await ChatRedisService.checkRateLimit(userId);
    console.log('✅ Rate Limit Check:', isAllowed);

    // 5. Test Room Management
    await ChatRedisService.createRoom(roomId, userId);
    await ChatRedisService.addUserToRoom(roomId, userId);
    const roomUsers = await ChatRedisService.getRoomUsers(roomId);
    console.log('✅ Room Users:', roomUsers);

    // Cleanup
    await redis.del(`user:${userId}:session`);
    await redis.del('online_users');
    await redis.del(`chat:${roomId}:messages`);
    await redis.del(`ratelimit:${userId}`);
    await redis.del(`room:${roomId}`);
    await redis.del(`room:${roomId}:users`);

    console.log('✅ All tests completed successfully!');
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await redis.quit();
  }
}

testRedisStructures(); 