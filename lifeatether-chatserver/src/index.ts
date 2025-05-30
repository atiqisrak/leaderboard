import dotenv from 'dotenv';
import Redis from 'ioredis';

dotenv.config();  // loads from .env.local

// validate our Redis env
const host = process.env.REDIS_HOST || '188.166.232.67';
const port = Number(process.env.REDIS_PORT) || 6379;
const password = process.env.REDIS_PASSWORD || 'Niloy@Niil9';

if (!host || isNaN(port) || !password) {
  console.error('🔴 Invalid Redis configuration:', {
    REDIS_HOST: host,
    REDIS_PORT: port,
    REDIS_PASSWORD: !!password,
  });
  process.exit(1);
}

const redis = new Redis({
  host,
  port,
  password,
  retryStrategy: (times) => {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
  maxRetriesPerRequest: 3,
  connectTimeout: 10000,
  enableReadyCheck: true,
  showFriendlyErrorStack: true,
  family: 4,   // Force IPv4
  db: 0        // Use default database
});

redis.on('error', (err) => {
  console.error('❌ Redis connection error:', err);
  console.error('Connection details:', {
    host: redis.options.host,
    port: redis.options.port,
    hasPassword: !!redis.options.password
  });
});

redis.on('connect', () => {
  console.log('✅ Successfully connected to Redis');
});

// Test the connection immediately
redis.ping().then(() => {
  console.log('✅ Redis connection test successful');
}).catch((err) => {
  console.error('❌ Redis connection test failed:', err);
});

export default redis;
