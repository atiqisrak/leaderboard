"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface ChatUser {
  id: string;
  name: string;
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount?: number;
}

export default function ChatListPage() {
  const [users, setUsers] = useState<ChatUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/login');
          return;
        }

        const response = await fetch('http://localhost:3096/api/users', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }

        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [router]);

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Header */}
      <div className="bg-[var(--card-bg)] p-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold">Messages</h1>
        <button
          onClick={() => {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            router.push('/login');
          }}
          className="text-[var(--text-color)] hover:opacity-80"
        >
          Logout
        </button>
      </div>

      {/* Chat List */}
      <div className="p-4 space-y-4">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--primary-color)]"></div>
          </div>
        ) : users.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-[var(--light-text)]">
            <p>No conversations yet</p>
            <p className="text-sm">Start chatting with someone!</p>
          </div>
        ) : (
          users.map((user) => (
            <div
              key={user.id}
              onClick={() => router.push(`/chats/${user.id}`)}
              className="bg-[var(--card-bg)] p-4 rounded-lg cursor-pointer hover:bg-[var(--section-bg)] transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="relative w-12 h-12 rounded-full bg-[var(--primary-color)] flex items-center justify-center text-white font-bold">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold truncate">{user.name}</h3>
                    {user.lastMessageTime && (
                      <span className="text-xs text-[var(--light-text)]">
                        {new Date(user.lastMessageTime).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    )}
                  </div>
                  {user.lastMessage && (
                    <p className="text-sm text-[var(--light-text)] truncate">
                      {user.lastMessage}
                    </p>
                  )}
                </div>
                {user.unreadCount && user.unreadCount > 0 && (
                  <div className="bg-[var(--primary-color)] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {user.unreadCount}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
} 