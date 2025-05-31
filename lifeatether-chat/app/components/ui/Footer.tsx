import Image from 'next/image'
import React from 'react'

const tabs = [
  { key: 'chats', icon: '/icons/message.svg', alt: 'Messages' },
  { key: 'users', icon: '/icons/users.svg', alt: 'Users' },
  { key: 'settings', icon: '/icons/setting.svg', alt: 'Settings' },
];

interface FooterProps {
  activeTab: 'chats' | 'users' | 'settings';
  onTabChange: (tab: 'chats' | 'users' | 'settings') => void;
}

const Footer = ({ activeTab, onTabChange }: FooterProps) => {
  return (
    <div className="bg-gray-800 px-10 py-6 flex items-center justify-between fixed bottom-0 left-0 right-0 rounded-t-3xl z-50">
      {tabs.map(tab => {
        const isActive = activeTab === tab.key;
        return (
          <button
            key={tab.key}
            onClick={() => onTabChange(tab.key as 'chats' | 'users' | 'settings')}
            className={`flex flex-col items-center focus:outline-none ${isActive ? 'opacity-100' : 'opacity-50 hover:opacity-80'}`}
            aria-label={tab.alt}
          >
            <Image src={tab.icon} alt={tab.alt} width={30} height={30} />
            {isActive && <span className="block w-2 h-2 bg-yellow-400 rounded-full mt-1" />}
          </button>
        );
      })}
    </div>
  )
}

export default Footer