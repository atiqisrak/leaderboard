"use client";
import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Socket } from 'socket.io-client';
import { ChatContextType, Message } from './chat/types';
import { SocketManager } from './chat/socketManager';
import { RoomManager } from './chat/roomManager';

const ChatContext = createContext<ChatContextType | null>(null);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [currentRoom, setCurrentRoom] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSocketConnected, setIsSocketConnected] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const router = useRouter();

  const socketManager = new SocketManager();
  const [roomManager, setRoomManager] = useState<RoomManager | null>(null);

  // Initialize socket connection
  useEffect(() => {
    const initializeSocket = async () => {
      const token = localStorage.getItem('token');
      console.log('Debug - Token from localStorage:', token);
      
      if (!token) {
        console.log('Debug - No token found, redirecting to login');
        router.push('/login');
        return;
      }

      try {
        const socket = await socketManager.initializeSocket(token);
        setSocket(socket);
        setRoomManager(new RoomManager(socket));
        setIsSocketConnected(true);
        setIsInitialized(true);

        socket.on('disconnect', () => {
          console.log('Debug - Socket disconnected');
          setIsSocketConnected(false);
        });

        socket.on('receive_message', (message: Message) => {
          console.log('Debug - Received message:', message);
          setMessages(prev => {
            if (prev.some(m => m.id === message.id)) {
              return prev;
            }
            return [...prev, message];
          });
        });

        // If we have a current room, rejoin it after connection
        if (currentRoom) {
          console.log('Debug - Rejoining room after connection:', currentRoom);
          await joinRoom(currentRoom);
        }
      } catch (error) {
        console.error('Debug - Socket initialization error:', error);
        setError('Failed to connect to chat server. Please try again.');
        if (error instanceof Error && error.message.includes('authentication')) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          router.push('/login');
        }
      }
    };

    initializeSocket();

    return () => {
      socketManager.disconnect();
    };
  }, [router]);

  const joinRoom = async (roomId: string) => {
    console.log('Debug - joinRoom called with roomId:', roomId);
    
    if (!isInitialized) {
      console.log('Debug - Socket not initialized yet, will retry room join');
      // Wait for socket initialization
      await new Promise(resolve => {
        const checkInterval = setInterval(() => {
          if (isInitialized) {
            clearInterval(checkInterval);
            resolve(true);
          }
        }, 100);
      });
    }
    
    if (!roomManager) {
      console.log('Debug - No room manager available, cannot join room');
      return;
    }
    
    if (roomId === currentRoom) {
      console.log('Debug - Already in room:', roomId);
      return;
    }
    
    setIsLoading(true);
    setError(null);
    try {
      // Leave current room if any
      if (currentRoom) {
        roomManager.leaveRoom(currentRoom);
      }

      // Join new room and fetch messages
      const newMessages = await roomManager.joinRoom(roomId);
      setCurrentRoom(roomId);
      setMessages(newMessages);
    } catch (error) {
      console.error('Debug - Error joining room:', error);
      setError(error instanceof Error ? error.message : 'Failed to load messages');
      setCurrentRoom(null);
    } finally {
      setIsLoading(false);
    }
  };

  const leaveRoom = () => {
    if (!roomManager || !currentRoom) return;
    roomManager.leaveRoom(currentRoom);
    setCurrentRoom(null);
  };

  const sendMessage = (message: string) => {
    if (!roomManager || !currentRoom) {
      setError('Not connected to chat server');
      return;
    }
    roomManager.sendMessage(currentRoom, message);
  };

  return (
    <ChatContext.Provider value={{
      socket,
      currentRoom,
      messages,
      isLoading,
      error,
      isSocketConnected,
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
