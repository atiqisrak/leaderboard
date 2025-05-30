import { Socket } from 'socket.io-client';
import { Message, CHAT_SERVER_URL } from './types';

export class RoomManager {
  constructor(private socket: Socket | null) {}

  async joinRoom(roomId: string): Promise<Message[]> {
    if (!this.socket) {
      throw new Error('Socket not available');
    }

    console.log('Debug - Joining room:', roomId);
    this.socket.emit('join_room', roomId);

    // Fetch message history
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }

    console.log('Debug - Fetching messages for room:', roomId);
    const res = await fetch(`${CHAT_SERVER_URL}/api/rooms/${roomId}/messages`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    });
    
    if (!res.ok) {
      if (res.status === 401) {
        throw new Error('Authentication failed. Please log in again.');
      }
      throw new Error('Failed to fetch messages');
    }
    
    const data = await res.json();
    console.log('Debug - Fetched messages:', data);
    
    // Sort messages by timestamp
    return data.sort((a: Message, b: Message) => 
      new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
  }

  leaveRoom(roomId: string): void {
    if (!this.socket) return;
    console.log('Debug - Leaving room:', roomId);
    this.socket.emit('leave_room', roomId);
  }

  sendMessage(roomId: string, message: string): void {
    if (!this.socket) {
      throw new Error('Socket not available');
    }
    console.log('Debug - Sending message to room:', roomId);
    const messageData = {
      roomId,
      message,
      timestamp: new Date().toISOString()
    };
    this.socket.emit('send_message', messageData);
  }
} 