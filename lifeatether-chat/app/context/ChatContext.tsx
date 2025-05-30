"use client";
import { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useRouter } from 'next/navigation';

const CHAT_SERVER_URL = process.env.NEXT_PUBLIC_CHAT_SERVER_URL || 'http://localhost:3096';

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
  userId: number;
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
  const router = useRouter();

  // Initialize socket connection
  useEffect(() => {
    const initializeSocket = () => {
      const token = localStorage.getItem('token');
      console.log('Debug - Token from localStorage:', token);
      
      if (!token) {
        console.log('Debug - No token found, redirecting to login');
        router.push('/login');
        return;
      }

      // Initialize socket connection with authentication
      const newSocket = io(CHAT_SERVER_URL, {
        auth: {
          token: `Bearer ${token}` // Add Bearer prefix
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

      newSocket.on('connect', () => {
        console.log('Connected to chat server');
        setError(null);
      });

      newSocket.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
        if (error.message.includes('authentication')) {
          setError('Authentication failed. Please log in again.');
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          router.push('/login');
        } else if (error.message.includes('transport')) {
          // Try to reconnect with polling if websocket fails
          const currentTransports = newSocket.io?.opts?.transports;
          if (currentTransports && currentTransports[0] === 'websocket') {
            newSocket.io.opts.transports = ['polling', 'websocket'];
            newSocket.connect();
          } else {
            setError('Failed to connect to chat server. Please try again.');
          }
        } else {
          setError('Failed to connect to chat server. Please try again.');
        }
      });

      newSocket.on('disconnect', (reason) => {
        console.log('Disconnected:', reason);
        if (reason === 'io server disconnect') {
          // Server initiated disconnect, try to reconnect
          newSocket.connect();
        } else if (reason === 'transport close') {
          // Transport closed, try to reconnect
          setTimeout(() => {
            newSocket.connect();
          }, 1000);
        }
      });

      newSocket.on('receive_message', (message: Message) => {
        console.log('Received message:', message);
        setMessages(prev => {
          // Check if message already exists to prevent duplicates
          if (prev.some(m => m.id === message.id)) {
            return prev;
          }
          return [...prev, message];
        });
      });

      setSocket(newSocket);
    };

    // Add a small delay to ensure localStorage is updated
    const timeoutId = setTimeout(initializeSocket, 100);

    return () => {
      clearTimeout(timeoutId);
      if (socket?.connected) {
        socket.disconnect();
      }
    };
  }, [router]);

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
      console.log('Joining room:', roomId);
      socket.emit('join_room', roomId);
      setCurrentRoom(roomId);

      // Fetch message history
      const token = localStorage.getItem('token');
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
      console.log('Fetched messages:', data);
      
      // Sort messages by timestamp
      const sortedMessages = data.sort((a: Message, b: Message) => 
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      );
      setMessages(sortedMessages);
    } catch (error) {
      console.error('Error joining room:', error);
      setError(error instanceof Error ? error.message : 'Failed to load messages');
    } finally {
      setIsLoading(false);
    }
  };

  const leaveRoom = () => {
    if (!socket || !currentRoom) return;
    console.log('Leaving room:', currentRoom);
    socket.emit('leave_room', currentRoom);
    setCurrentRoom(null);
  };

  const sendMessage = (message: string) => {
    if (!socket || !currentRoom) {
      setError('Not connected to chat server');
      return;
    }
    console.log('Sending message to room:', currentRoom);
    const messageData = {
      roomId: currentRoom,
      message,
      timestamp: new Date().toISOString()
    };
    socket.emit('send_message', messageData);
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
