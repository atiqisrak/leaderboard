import { Socket } from 'socket.io-client';

export interface Message {
  id: number;
  userId: number;
  message: string;
  timestamp: string;
}

export interface ChatContextType {
  socket: Socket | null;
  currentRoom: string | null;
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  isSocketConnected: boolean;
  sendMessage: (message: string) => void;
  joinRoom: (roomId: string) => Promise<void>;
  leaveRoom: () => void;
}

export const CHAT_SERVER_URL = process.env.NEXT_PUBLIC_CHAT_SERVER_URL || 'http://localhost:3096'; 