import redis from './index';

async function migrateChats() {
  try {
    console.log('Starting chat migration...');
    
    // Get all chat room keys
    const keys = await redis.keys('chat:*:messages');
    console.log(`Found ${keys.length} chat rooms`);

    for (const key of keys) {
      const roomId = key.replace('chat:', '').replace(':messages', '');
      console.log(`Processing room: ${roomId}`);

      // Get all messages for this room
      const messages = await redis.lrange(key, 0, -1);
      if (messages.length === 0) continue;

      // Get the last message
      const lastMessage = JSON.parse(messages[0]);
      
      // Extract user IDs from room ID
      const [_, user1Id, user2Id] = roomId.split('_');
      
      // Create last message info
      const lastMessageInfo = {
        roomId,
        lastMessage: lastMessage.message,
        lastMessageTime: lastMessage.timestamp,
        otherUserId: lastMessage.userId === user1Id ? user2Id : user1Id
      };

      // Update both users' chat lists
      await redis.sadd(`user:${user1Id}:chats`, roomId);
      await redis.sadd(`user:${user2Id}:chats`, roomId);
      
      // Update last message info for both users
      await redis.hset(`user:${user1Id}:last_messages`, roomId, JSON.stringify(lastMessageInfo));
      await redis.hset(`user:${user2Id}:last_messages`, roomId, JSON.stringify(lastMessageInfo));

      console.log(`Processed room ${roomId} with ${messages.length} messages`);
    }

    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    process.exit(0);
  }
}

migrateChats(); 