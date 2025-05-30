"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ChatList from '../components/ChatList';
import UserList from '../components/UserList';

export default function ChatListPage() {
  const [activeTab, setActiveTab] = useState<'chats' | 'users'>('chats');
  const router = useRouter();

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

      {/* Tabs */}
      <div className="flex border-b border-[var(--section-bg)]">
        <button
          className={`flex-1 p-4 text-center ${
            activeTab === 'chats'
              ? 'border-b-2 border-[var(--primary-color)] text-[var(--primary-color)]'
              : 'text-[var(--light-text)]'
          }`}
          onClick={() => setActiveTab('chats')}
        >
          Chats
        </button>
        <button
          className={`flex-1 p-4 text-center ${
            activeTab === 'users'
              ? 'border-b-2 border-[var(--primary-color)] text-[var(--primary-color)]'
              : 'text-[var(--light-text)]'
          }`}
          onClick={() => setActiveTab('users')}
        >
          Users
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        {activeTab === 'chats' ? <ChatList /> : <UserList />}
      </div>
    </div>
  );
} 