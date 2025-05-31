"use client";
import { useEffect, useState, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useChat } from '../../context/ChatContext';
import { Message } from '../../context/chat/types';
import EmojiConverter from '../../components/EmojiConverter';
import ChatMessage from '../../components/ChatMessage';
import Image from 'next/image';

const CHAT_SERVER_URL = process.env.NEXT_PUBLIC_CHAT_SERVER_URL || 'http://localhost:3096';
const ENGINE_URL = process.env.NEXT_PUBLIC_ENGINE_URL || 'http://localhost:3098';

export default function ChatWindow({ params }: { params: { roomId: string } }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [receiverName, setReceiverName] = useState<string>("Receiver");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const chatContext = useChat();

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      setCurrentUserId(user.id);
    }
  }, []);

  useEffect(() => {
    const fetchReceiverName = async () => {
      try {
        // First check if name is in URL params
        const nameFromUrl = searchParams.get('name');
        if (nameFromUrl) {
          setReceiverName(nameFromUrl);
          return;
        }

        // If not in URL, fetch from API
        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/login');
          return;
        }

        // Extract the other user's ID from the room ID
        const parts = params.roomId.split('_');
        let otherUserId: string;
        
        if (parts.length === 2) {
          // Format: chat_1
          otherUserId = parts[1];
        } else if (parts.length === 3) {
          // Format: chat_1_20
          const currentUserId = JSON.parse(localStorage.getItem('user') || '{}').id.toString();
          otherUserId = parts[1] === currentUserId ? parts[2] : parts[1];
        } else {
          console.error('Invalid room ID format:', params.roomId);
          return;
        }

        // Get user details from main server
        const userRes = await fetch(`${ENGINE_URL}/api/v1/users/${otherUserId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!userRes.ok) {
          throw new Error('Failed to fetch user details');
        }

        const user = await userRes.json();
        setReceiverName(user.name);
      } catch (error) {
        console.error('Error fetching receiver name:', error);
      }
    };

    fetchReceiverName();
  }, [params.roomId, searchParams, router]);

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
        setMessages(data.reverse());
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

  console.log("params", params);

  return (
    <div className="flex flex-col h-screen bg-[var(--background)]">
      {/* Header */}
      <div className="bg-[var(--card-bg)] p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Image
            src="/icons/arrow-left.svg"
            alt="Back"
            width={30}
            height={30}
            className="cursor-pointer"
            onClick={() => router.back()}
          />
          <span className="text-lg font-semibold">{receiverName}</span>
        </div>
        <div className="flex items-center gap-4">
          <Image src="/icons/call.svg" alt="Call" width={30} height={30} className="cursor-pointer" />
          <Image src="/icons/video.svg" alt="Video" width={30} height={30} className="cursor-pointer" />
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <ChatMessage
            key={message.id}
            message={message}
            isCurrentUser={message.userId === currentUserId}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <form onSubmit={handleSendMessage} className="p-4 bg-[var(--card-bg)]">
        <div className="flex gap-2">
          <Image src="/icons/smile.svg" alt="Smile" width={30} height={30} className="cursor-pointer" />
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 p-3 rounded-xl bg-[var(--section-bg)] text-[var(--text-color)] border border-[var(--border-color)] focus:outline-none focus:border-[var(--primary-color)]"
          />
          <Image src="/icons/send.svg" alt="Send" width={30} height={30} className="cursor-pointer rotate-45"
            onClick={handleSendMessage}
          />
        </div>
      </form>
    </div>
  );
} 