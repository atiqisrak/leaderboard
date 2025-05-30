"use client";
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useChat } from '../../context/ChatContext';
import { Message } from '../../context/chat/types';

const CHAT_SERVER_URL = process.env.NEXT_PUBLIC_CHAT_SERVER_URL || 'http://localhost:3096';

export default function ChatWindow({ params }: { params: { roomId: string } }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const chatContext = useChat();

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      setCurrentUserId(user.id);
    }
  }, []);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/login');
          return;
        }

        const response = await fetch(`${CHAT_SERVER_URL}/api/rooms/${params.roomId}/messages`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch messages');
        }

        const data = await response.json();
        setMessages(data);
      } catch (error) {
        console.error('Error fetching messages:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMessages();
  }, [params.roomId, router]);

  useEffect(() => {
    if (!chatContext?.socket) return;

    // Join the room
    chatContext.socket.emit('join_room', params.roomId);

    // Listen for new messages
    const handleNewMessage = (message: Message) => {
      setMessages(prev => [...prev, message]);
      scrollToBottom();
    };

    chatContext.socket.on('receive_message', handleNewMessage);

    return () => {
      chatContext.socket?.off('receive_message', handleNewMessage);
    };
  }, [chatContext?.socket, params.roomId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !chatContext?.socket) return;

    chatContext.socket.emit('send_message', {
      roomId: params.roomId,
      message: newMessage.trim()
    });

    setNewMessage('');
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--primary-color)]"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-[var(--background)]">
      {/* Header */}
      <div className="bg-[var(--card-bg)] p-4 flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="text-[var(--text-color)] hover:opacity-80"
        >
          ← Back
        </button>
        <h1 className="text-xl font-semibold">Chat</h1>
        <div className="w-8"></div> {/* Spacer for alignment */}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.userId.toString() === currentUserId ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[70%] rounded-lg p-3 ${
                message.userId.toString() === currentUserId
                  ? 'bg-[var(--primary-color)] text-white'
                  : 'bg-[var(--card-bg)]'
              }`}
            >
              <p>{message.message}</p>
              <p className="text-xs opacity-70 mt-1">
                {new Date(message.timestamp).toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <form onSubmit={handleSendMessage} className="p-4 bg-[var(--card-bg)]">
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 p-2 rounded-lg bg-[var(--section-bg)] text-[var(--text-color)]"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-[var(--primary-color)] text-white rounded-lg hover:opacity-90"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
} 