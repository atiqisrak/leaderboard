"use client";
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useChat } from '../../context/ChatContext';

const ENGINE_URL = process.env.NEXT_PUBLIC_ENGINE_URL || 'http://localhost:3098';

interface User {
  id: number;
  name: string;
}

export default function ChatPage({ params }: { params: { id: string } }) {
  const [message, setMessage] = useState('');
  const [receiverName, setReceiverName] = useState<string>('');
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [pageError, setPageError] = useState<string | null>(null);
  const router = useRouter();
  const chatContext = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  if (!chatContext) return null;

  const { messages, sendMessage, joinRoom, leaveRoom, isLoading, error: chatError, isSocketConnected } = chatContext;

  useEffect(() => {
    // Get current user info from localStorage
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      setCurrentUserId(user.id.toString());
    }

    // Fetch receiver's info
    const fetchReceiverInfo = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/login');
          return;
        }

        // Extract numeric ID from the params.id
        const parts = params.id.split('_');
        const receiverId = parts[parts.length - 1]; // Get the last part which is the receiver's ID
        if (!receiverId) {
          throw new Error('Invalid user ID');
        }

        const response = await fetch(`${ENGINE_URL}/api/v1/users/${receiverId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user info');
        }

        const userData: User = await response.json();
        setReceiverName(userData.name);
      } catch (error) {
        console.error('Error fetching receiver info:', error);
        setPageError('Failed to load user info');
      }
    };

    fetchReceiverInfo();

    // Generate consistent room ID
    const generateRoomId = (userId1: string, userId2: string) => {
      console.log('Debug - Generating room ID with params:', { userId1, userId2, urlId: params.id });
      
      // Extract numeric IDs from the strings
      const id1 = parseInt(userId1.replace(/\D/g, ''));
      let id2: number;
      
      // Handle both URL formats: chat_20 and chat_1_20
      if (params.id.startsWith('chat_')) {
        const parts = params.id.split('_');
        console.log('Debug - URL parts:', parts);
        if (parts.length === 2) {
          // Format: chat_20
          id2 = parseInt(parts[1]);
          console.log('Debug - Using format chat_20, extracted id2:', id2);
        } else if (parts.length === 3) {
          // Format: chat_1_20
          id2 = parseInt(parts[2]);
          console.log('Debug - Using format chat_1_20, extracted id2:', id2);
        } else {
          console.error('Debug - Invalid room ID format:', params.id);
          return null;
        }
      } else {
        // Direct user ID format
        id2 = parseInt(userId2.replace(/\D/g, ''));
        console.log('Debug - Using direct user ID format, extracted id2:', id2);
      }
      
      if (isNaN(id1) || isNaN(id2)) {
        console.error('Debug - Invalid user IDs:', { userId1, userId2, id1, id2 });
        return null;
      }

      // Sort user IDs to ensure consistent room ID regardless of who initiates
      const [smallerId, largerId] = [id1, id2].sort((a, b) => a - b);
      const roomId = `chat_${smallerId}_${largerId}`;
      console.log('Debug - Generated room ID:', roomId, 'from user IDs:', { id1, id2 });
      return roomId;
    };

    const joinRoomIfReady = async () => {
      if (!currentUserId) {
        console.log('Debug - No current user ID available');
        return;
      }

      if (!isSocketConnected) {
        console.log('Debug - Socket not connected yet, waiting...');
        return;
      }

      console.log('Debug - Current user ID:', currentUserId);
      const roomId = generateRoomId(currentUserId, params.id);
      if (roomId) {
        console.log('Debug - Joining room:', roomId);
        await joinRoom(roomId);
      } else {
        console.error('Debug - Failed to generate room ID');
        setPageError('Invalid user ID');
      }
    };

    joinRoomIfReady();

    // Leave the room when the component unmounts
    return () => {
      leaveRoom();
    };
  }, [params.id, currentUserId, isSocketConnected]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    sendMessage(message);
    setMessage('');
  };

  return (
    <div className="min-h-screen bg-[var(--background)] flex flex-col">
      {/* Header */}
      <div className="bg-[var(--card-bg)] p-4 flex items-center gap-4 border-b border-[var(--border-color)]">
        <button
          onClick={() => router.push('/chats')}
          className="text-[var(--text-color)] hover:opacity-80"
        >
          ←
        </button>
        <div className="flex-1">
          <h1 className="text-xl font-semibold">{receiverName}</h1>
          <p className="text-sm text-[var(--light-text)]">Active now</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--primary-color)]"></div>
          </div>
        ) : pageError || chatError ? (
          <div className="flex justify-center items-center h-full">
            <div className="text-red-500">{pageError || chatError}</div>
          </div>
        ) : (
          <>
            {messages.length === 0 ? (
              <div className="flex justify-center items-center h-full text-[var(--light-text)]">
                <div className="text-center">
                  <p className="text-lg font-semibold mb-2">No messages yet</p>
                  <p className="text-sm">Start the conversation!</p>
                </div>
              </div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.userId.toString() === currentUserId ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[70%] rounded-2xl p-3 ${
                      msg.userId.toString() === currentUserId
                        ? 'bg-[var(--primary-color)] text-white rounded-br-none'
                        : 'bg-[var(--section-bg)] text-[var(--text-color)] rounded-bl-none'
                    }`}
                  >
                    <p className="break-words">{msg.message}</p>
                    <span className="text-xs opacity-70 mt-1 block">
                      {new Date(msg.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Message Input */}
      <form onSubmit={handleSendMessage} className="p-4 bg-[var(--card-bg)] border-t border-[var(--border-color)]">
        <div className="flex gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 rounded-full bg-[var(--section-bg)] text-[var(--text-color)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
            disabled={isLoading || !!pageError || !!chatError}
          />
          <button
            type="submit"
            className="bg-[var(--primary-color)] text-white px-6 py-2 rounded-full hover:opacity-90 disabled:opacity-50 transition-opacity"
            disabled={isLoading || !!pageError || !!chatError || !message.trim()}
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}
