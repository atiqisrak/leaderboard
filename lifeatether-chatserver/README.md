# LifeAtEther Chat Server

A real-time chat server built with Socket.IO and Redis for the LifeAtEther chat application.

## Prerequisites

- Node.js (v14 or higher)
- Redis server (local or Redis Cloud)
- npm or yarn

## Setup

1. Install dependencies:

```bash
npm install
```

2. Set up Redis:

   - **Option 1: Local Redis**

     ```bash
     # Install Redis locally
     # On macOS:
     brew install redis
     # Start Redis server
     redis-server
     ```

   - **Option 2: Redis Cloud (Free Tier)**
     1. Go to [Redis Cloud](https://redis.com/try-free/)
     2. Sign up for a free account
     3. Create a new subscription (free tier)
     4. Create a new database
     5. Copy the connection URL provided

3. Create a `.env` file in the root directory with the following variables:

```
PORT=3098
CLIENT_URL=http://localhost:3097
# For local Redis
REDIS_URL=redis://localhost:6379
# OR for Redis Cloud (replace with your credentials)
# REDIS_URL=redis://username:password@host:port
```

4. Start the chat server:

```bash
# Development mode
npm run dev

# Production mode
npm run build
npm start
```

## Features

- Real-time messaging using Socket.IO
- Message persistence with Redis
- Room-based chat functionality
- Message history retrieval
- CORS enabled for client application

## API Endpoints

- `GET /api/messages/:roomId` - Get chat history for a specific room

## Socket.IO Events

- `join_room` - Join a chat room
- `leave_room` - Leave a chat room
- `send_message` - Send a message to a room
- `receive_message` - Receive a message from a room

## Message Format

```typescript
{
  id: string;
  userId: string;
  username: string;
  message: string;
  timestamp: string;
}
```
