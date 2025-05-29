"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";

interface Message {
  from: "me" | "them";
  text: string;
  time: string;
}

interface ChatContextType {
  selectedChat: string | null;
  selectChat: (id: string) => void;
  messages: Record<string, Message[]>;
  sendMessage: (chatId: string, message: Message) => void;
}

const ChatContext = createContext<ChatContextType | null>(null);

export function useChat() {
  return useContext(ChatContext);
}

export function ChatProvider({ children }: { children: ReactNode }) {
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [messages, setMessages] = useState<Record<string, Message[]>>({});

  const selectChat = (id: string) => setSelectedChat(id);

  const sendMessage = (chatId: string, message: Message) => {
    setMessages((prev) => ({
      ...prev,
      [chatId]: [...(prev[chatId] || []), message],
    }));
  };

  return (
    <ChatContext.Provider value={{ selectedChat, selectChat, messages, sendMessage }}>
      {children}
    </ChatContext.Provider>
  );
}
