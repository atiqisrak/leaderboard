import { io, Socket } from 'socket.io-client';
import { CHAT_SERVER_URL } from './types';

export class SocketManager {
  private socket: Socket | null = null;
  private connectionPromise: Promise<void> | null = null;

  constructor() {}

  async initializeSocket(token: string): Promise<Socket> {
    if (this.socket?.connected) {
      return this.socket;
    }

    if (this.connectionPromise) {
      await this.connectionPromise;
      return this.socket!;
    }

    this.connectionPromise = new Promise((resolve, reject) => {
      console.log('Debug - Initializing socket connection');
      this.socket = io(CHAT_SERVER_URL, {
        auth: {
          token: `Bearer ${token}`
        },
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        timeout: 45000,
        forceNew: true,
        upgrade: true,
        rememberUpgrade: true,
        autoConnect: true
      });

      this.socket.on('connect', () => {
        console.log('Debug - Connected to chat server');
        resolve();
      });

      this.socket.on('connect_error', (error) => {
        console.error('Debug - Socket connection error:', error);
        reject(error);
      });
    });

    try {
      await this.connectionPromise;
      return this.socket!;
    } finally {
      this.connectionPromise = null;
    }
  }

  getSocket(): Socket | null {
    return this.socket;
  }

  disconnect(): void {
    if (this.socket?.connected) {
      this.socket.disconnect();
    }
  }
} 