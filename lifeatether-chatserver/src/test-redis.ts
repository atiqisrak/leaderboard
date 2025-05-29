import Redis from 'ioredis';
import dotenv from 'dotenv';

dotenv.config();

const redis = new Redis(process.env.REDIS_URL || '');

async function testRedisConnection() {
  try {
    // Test connection
    await redis.ping();
    console.log('✅ Successfully connected to Redis Cloud');

    // Test write
    await redis.set('test-key', 'Hello from LifeAtEther Chat!');
    console.log('✅ Successfully wrote to Redis');

    // Test read
    const value = await redis.get('test-key');
    console.log('✅ Successfully read from Redis:', value);

    // Test list operations (used in chat)
    await redis.lpush('test-chat', JSON.stringify({
      id: Date.now().toString(),
      message: 'Test message',
      timestamp: new Date().toISOString()
    }));
    console.log('✅ Successfully tested list operations');

    // Clean up test data
    await redis.del('test-key');
    await redis.del('test-chat');
    console.log('✅ Successfully cleaned up test data');

  } catch (error) {
    console.error('❌ Redis connection test failed:', error);
  } finally {
    await redis.quit();
    console.log('Connection closed');
  }
}

testRedisConnection(); 