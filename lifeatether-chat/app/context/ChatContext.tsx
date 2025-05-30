"use client";
import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { initializeSocket, joinRoom, sendMessage as socketSendMessage, onMessage, onTyping, disconnectSocket } from "../../lib/socket";

interface Message {
  from: "me" | "them";
  text: string;
  time: string;
  userId: string;
}

interface SocketMessage {
  roomId: string;
  message: string;
  userId: string;
  timestamp: string;
}

interface TypingStatus {
  userId: string;
  isTyping: boolean;
}

interface ChatContextType {
  selectedChat: string | null;
  selectChat: (id: string) => void;
  messages: Record<string, Message[]>;
  sendMessage: (chatId: string, message: Message) => void;
  isTyping: Record<string, boolean>;
  isSocketReady: boolean;
}

const ChatContext = createContext<ChatContextType | null>(null);

export function useChat() {
  return useContext(ChatContext);
}

export function ChatProvider({ children }: { children: ReactNode }) {
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [messages, setMessages] = useState<Record<string, Message[]>>({});
  const [isTyping, setIsTyping] = useState<Record<string, boolean>>({});
  const [isSocketReady, setIsSocketReady] = useState(false);

  // Initialize socket and set up listeners
  useEffect(() => {
    const initializeSocketAndListeners = async () => {
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user') || '{}');

      if (!token || !user.id) {
        return;
      }

      try {
        initializeSocket(user.id);
        setIsSocketReady(true);

        // Set up message listener
        onMessage((message: SocketMessage) => {
          setMessages((prev) => ({
            ...prev,
            [message.roomId]: [
              ...(prev[message.roomId] || []),
              {
                from: "them",
                text: message.message,
                time: new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                userId: message.userId
              }
            ]
          }));
        });

        // Set up typing listener
        onTyping(({ userId, isTyping }: TypingStatus) => {
          setIsTyping((prev) => ({
            ...prev,
            [userId]: isTyping
          }));
        });
      } catch (error) {
        console.error('Socket initialization failed:', error);
        setIsSocketReady(false);
      }
    };

    initializeSocketAndListeners();

    return () => {
      disconnectSocket();
      setIsSocketReady(false);
    };
  }, []);

  const selectChat = (id: string) => {
    if (!isSocketReady) return;
    setSelectedChat(id);
    joinRoom(id);
  };

  const sendMessage = (chatId: string, message: Message) => {
    if (!isSocketReady) return;
    
    // Add message to local state
    setMessages((prev) => ({
      ...prev,
      [chatId]: [...(prev[chatId] || []), message],
    }));

    // Send message through socket
    socketSendMessage(chatId, message.text, message.userId);
  };

  return (
    <ChatContext.Provider value={{ selectedChat, selectChat, messages, sendMessage, isTyping, isSocketReady }}>
      {children}
    </ChatContext.Provider>
  );
}
