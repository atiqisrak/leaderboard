"use client"
import SettingList from '../components/settings/SettingList';
import Footer from '../components/ui/Footer';
import Header from '../components/ui/Header';
import { useState } from 'react';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'chats' | 'users' | 'settings'>('settings');

  let content = null;
  if (activeTab === 'settings') {
    content = <SettingList />;
  } else if (activeTab === 'users') {
    content = <div className="p-8 text-center text-lg text-gray-500">Users tab content (coming soon)</div>;
  } else if (activeTab === 'chats') {
    content = <div className="p-8 text-center text-lg text-gray-500">Chats tab content (coming soon)</div>;
  }

  return (
    <div className="bg-[var(--background)] min-h-screen pb-32">
      {/* <h1 className="text-2xl font-bold mb-6">Settings</h1> */}
      <Header />
      <div className="p-4">
        {content}
      </div>
      <Footer activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}
