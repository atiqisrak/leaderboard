"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ChatList from '../components/ChatList';
import UserList from '../components/UserList';
import Image from 'next/image';
import Header from '../components/ui/Header';
import Search from '../components/ui/Search';
import Footer from '../components/ui/Footer';
import SettingList from '../components/settings/SettingList';

export default function ChatListPage() {
  const [activeTab, setActiveTab] = useState<'chats' | 'users' | 'settings'>('chats');
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Header */}
      <Header />
      <Search />

      {/* Content */}
      <div className="p-4">
        {activeTab === 'chats' ? <ChatList /> : activeTab === 'users' ? <UserList /> : <SettingList />}
      </div>
      <Footer activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
} 