"use client";
import { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

interface ChatContextType {
  socket: Socket | null;
  currentRoom: string | null;
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  sendMessage: (message: string) => void;
  joinRoom: (roomId: string) => void;
  leaveRoom: () => void;
}

interface Message {
  id: number;
  userId: string;
  message: string;
  timestamp: string;
}

const ChatContext = createContext<ChatContextType | null>(null);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [currentRoom, setCurrentRoom] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize socket connection
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('No authentication token found. Please log in.');
      return;
    }

    // Initialize socket connection with authentication
    const newSocket = io('http://localhost:3096', {
      auth: {
        token: `Bearer ${token}` // Add Bearer prefix
      },
      transports: ['websocket', 'polling'], // Allow both WebSocket and polling
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      timeout: 10000, // Increase timeout to 10 seconds
    });

    newSocket.on('connect', () => {
      console.log('Connected to chat server');
      setError(null);
    });

    newSocket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      if (error.message.includes('authentication')) {
        setError('Authentication failed. Please log in again.');
      } else {
        setError('Failed to connect to chat server. Please try again.');
      }
    });

    newSocket.on('disconnect', (reason) => {
      console.log('Disconnected:', reason);
      if (reason === 'io server disconnect') {
        // Server initiated disconnect, try to reconnect
        newSocket.connect();
      }
    });

    newSocket.on('receive_message', (message: Message) => {
      setMessages(prev => [...prev, message]);
    });

    setSocket(newSocket);

    return () => {
      if (newSocket.connected) {
        newSocket.disconnect();
      }
    };
  }, []);

  const joinRoom = async (roomId: string) => {
    if (!socket || roomId === currentRoom) return;
    
    setIsLoading(true);
    setError(null);
    try {
      // Leave current room if any
      if (currentRoom) {
        socket.emit('leave_room', currentRoom);
      }

      // Join new room
      socket.emit('join_room', roomId);
      setCurrentRoom(roomId);
      setMessages([]); // Clear messages when changing rooms

      // Fetch message history
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:3096/api/rooms/${roomId}/messages`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!res.ok) {
        if (res.status === 401) {
          throw new Error('Authentication failed. Please log in again.');
        }
        throw new Error('Failed to fetch messages');
      }
      
      const data = await res.json();
      setMessages(data);
    } catch (error) {
      console.error('Error joining room:', error);
      setError(error instanceof Error ? error.message : 'Failed to load messages');
    } finally {
      setIsLoading(false);
    }
  };

  const leaveRoom = () => {
    if (!socket || !currentRoom) return;
    socket.emit('leave_room', currentRoom);
    setCurrentRoom(null);
    setMessages([]);
  };

  const sendMessage = (message: string) => {
    if (!socket || !currentRoom) {
      setError('Not connected to chat server');
      return;
    }
    socket.emit('send_message', {
      roomId: currentRoom,
      message
    });
  };

  return (
    <ChatContext.Provider value={{
      socket,
      currentRoom,
      messages,
      isLoading,
      error,
      sendMessage,
      joinRoom,
      leaveRoom
    }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  return useContext(ChatContext);
}
