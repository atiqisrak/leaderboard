import redis from './index';

(async () => {
  try {
    console.log('🔄 Attempting to connect to Redis...');
    console.log('Connection details:', {
      host: redis.options.host,
      port: redis.options.port,
      hasPassword: !!redis.options.password
    });

    const pong = await redis.ping();
    console.log('✅ Redis replied:', pong);  // should log "PONG"
    
    // Test a simple set/get operation
    await redis.set('test-key', 'Hello Redis!');
    const value = await redis.get('test-key');
    console.log('✅ Test set/get successful:', value);
    
  } catch (error: any) {
    console.error('❌ Redis test failed:', error);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      stack: error.stack
    });
    process.exit(1);
  } finally {
    await redis.quit();
    console.log('Connection closed');
  }
})();
