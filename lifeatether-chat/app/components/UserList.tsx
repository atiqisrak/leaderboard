"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const ENGINE_URL = process.env.NEXT_PUBLIC_ENGINE_URL || 'http://localhost:3098';

interface User {
  id: number;
  name: string;
}

export default function UserList() {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/login');
          return;
        }

        const res = await fetch(`${ENGINE_URL}/api/v1/users/all-names`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!res.ok) {
          throw new Error('Failed to fetch users');
        }

        const data = await res.json();
        setUsers(data);
      } catch (error) {
        console.error('Error fetching users:', error);
        setError('Failed to load users');
      }
    };

    fetchUsers();
  }, [router]);

  const handleUserClick = (userId: number) => {
    // Create a unique room ID for the chat
    const roomId = `chat_${userId}`;
    router.push(`/chats/${roomId}`);
  };

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="w-full bg-[var(--card-bg)] rounded-2xl shadow-lg">
      <h2 className="text-xl font-semibold p-4 border-b border-[var(--section-bg)]">
        Users
      </h2>
      <div className="max-h-[calc(100vh-200px)] overflow-y-auto">
        {users.map((user) => (
          <div
            key={user.id}
            className="flex items-center gap-4 px-4 py-3 border-b border-[var(--section-bg)] cursor-pointer hover:bg-[var(--section-bg)] transition"
            onClick={() => handleUserClick(user.id)}
          >
            <div className="w-10 h-10 rounded-full bg-[var(--primary-color)] flex items-center justify-center text-white">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <div className="font-semibold">{user.name}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 