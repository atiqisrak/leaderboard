declare namespace NodeJS {
  interface ProcessEnv {
    // Server
    PORT?: string;
    NODE_ENV?: 'development' | 'production' | 'test';
    
    // Database
    DB_HOST?: string;
    DB_PORT?: string;
    DB_NAME?: string;
    DB_USER?: string;
    DB_PASSWORD?: string;
    
    // JWT
    JWT_SECRET?: string;
    JWT_EXPIRES_IN?: string;
  }
} 