"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useChat } from '../context/ChatContext';

const ENGINE_URL = process.env.NEXT_PUBLIC_ENGINE_URL || 'http://localhost:3098';
const CHAT_SERVER_URL = process.env.NEXT_PUBLIC_CHAT_SERVER_URL || 'http://localhost:3096';

interface Chat {
  id: string;
  userId: number;
  userName: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
}

export default function ChatList() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [error, setError] = useState('');
  const router = useRouter();
  const chatContext = useChat();

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/login');
          return;
        }

        const userStr = localStorage.getItem('user');
        if (!userStr) {
          router.push('/login');
          return;
        }
        const currentUser = JSON.parse(userStr);

        // Fetch chat list from chat server
        const chatsRes = await fetch(`${CHAT_SERVER_URL}/api/chats`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!chatsRes.ok) {
          throw new Error('Failed to fetch chats');
        }

        const chatList = await chatsRes.json();
        
        // For each chat, fetch user details from main server
        const chatPromises = chatList.chats.map(async (chat: any) => {
          try {
            // Extract the other user's ID from the room ID
            let otherUserId: string;
            const parts = chat.roomId.split('_');
            
            if (parts.length === 2) {
              // Format: chat_1
              otherUserId = parts[1];
            } else if (parts.length === 3) {
              // Format: chat_1_20
              // If current user is the first number, get the second number
              // If current user is the second number, get the first number
              const currentUserId = currentUser.id.toString();
              otherUserId = parts[1] === currentUserId ? parts[2] : parts[1];
            } else {
              console.error('Invalid room ID format:', chat.roomId);
              return null;
            }

            // Skip if otherUserId is not a valid number
            if (isNaN(parseInt(otherUserId))) {
              console.error('Invalid user ID in room:', chat.roomId);
              return null;
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

            return {
              id: chat.roomId,
              userId: user.id,
              userName: user.name,
              lastMessage: chat.lastMessage,
              lastMessageTime: chat.lastMessageTime,
              unreadCount: chat.unreadCount || 0
            };
          } catch (error) {
            console.error(`Error fetching user details for chat ${chat.roomId}:`, error);
            return null;
          }
        });

        const chatResults = await Promise.all(chatPromises);
        // Filter out null results and sort by last message time
        const sortedChats = chatResults
          .filter((chat): chat is Chat => chat !== null)
          .sort((a, b) => new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime());
        
        setChats(sortedChats);
      } catch (error) {
        console.error('Error fetching chats:', error);
        setError('Failed to load chats');
      }
    };

    fetchChats();
  }, [router]);

  // Update chat list when new messages are received
  useEffect(() => {
    if (!chatContext) return;

    const handleNewMessage = (message: any) => {
      setChats(prevChats => {
        const chatIndex = prevChats.findIndex(chat => chat.id === chatContext.currentRoom);
        if (chatIndex === -1) return prevChats;

        const updatedChats = [...prevChats];
        updatedChats[chatIndex] = {
          ...updatedChats[chatIndex],
          lastMessage: message.message,
          lastMessageTime: message.timestamp
        };

        // Move the updated chat to the top
        const [updatedChat] = updatedChats.splice(chatIndex, 1);
        return [updatedChat, ...updatedChats];
      });
    };

    chatContext.socket?.on('receive_message', handleNewMessage);

    return () => {
      chatContext.socket?.off('receive_message', handleNewMessage);
    };
  }, [chatContext]);

  const handleChatClick = (chatId: string) => {
    router.push(`/chats/${chatId}`);
  };

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="w-full bg-[var(--card-bg)] rounded-2xl shadow-lg">
      <h2 className="text-xl font-semibold p-4 border-b border-[var(--section-bg)]">
        Recent Chats
      </h2>
      <div className="max-h-[calc(100vh-200px)] overflow-y-auto">
        {chats.length === 0 ? (
          <div className="p-4 text-center text-[var(--light-text)]">
            No recent chats
          </div>
        ) : (
          chats.map((chat) => (
            <div
              key={chat.id}
              className="flex items-center gap-4 px-4 py-3 border-b border-[var(--section-bg)] cursor-pointer hover:bg-[var(--section-bg)] transition"
              onClick={() => handleChatClick(chat.id)}
            >
              <div className="w-10 h-10 rounded-full bg-[var(--primary-color)] flex items-center justify-center text-white">
                {chat.userName.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold truncate">{chat.userName}</div>
                <div className="text-sm text-[var(--light-text)] truncate">
                  {chat.lastMessage || 'No messages yet'}
                </div>
              </div>
              <div className="text-xs text-[var(--light-text)]">
                {chat.lastMessageTime ? new Date(chat.lastMessageTime).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit'
                }) : ''}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
} 