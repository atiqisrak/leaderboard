"use client";
import { useState } from 'react';
import EmojiConverter from './EmojiConverter';

interface ChatMessageProps {
  message: {
    id: number;
    userId: number;
    message: string;
    timestamp: string;
  };
  isCurrentUser: boolean;
}

// Helper function to detect emoji-only messages
function isEmojiOnlyMessage(text: string) {
  // List of emojis from emojiMap in EmojiConverter
  const emojiList = [
    '😊','😃','😢','😛','😐','😮','😘','😕','😳'
  ];
  // Convert emoticons to emojis (same as EmojiConverter)
  let converted = text;
  const emoticonMap = {
    ':-)': '😊', ':)': '😊', ':-D': '😃', ':D': '😃', ':-(': '😢', ':(': '😢',
    ':-P': '😛', ':-p': '😛', ':P': '😛', ':p': '😛', ':-|': '😐', ':|': '😐',
    ':-O': '😮', ':-o': '😮', ':O': '😮', ':o': '😮', ':-*': '😘', ':*': '😘',
    ':-/': '😕', ':/': '😕', ':-\\': '😕', ':\\': '😕', ':-$': '😳', ':$': '😳',
  };
  Object.entries(emoticonMap).forEach(([emoticon, emoji]) => {
    const escapedEmoticon = emoticon.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`\\b${escapedEmoticon}\\b|${escapedEmoticon}`, 'gi');
    converted = converted.replace(regex, emoji);
  });
  return converted.trim().length > 0 && converted.trim().split('').every(char => emojiList.includes(char) || char === ' ' || char === '\n');
}

export default function ChatMessage({ message, isCurrentUser }: ChatMessageProps) {
  const isEmojiOnly = isEmojiOnlyMessage(message.message);

  return (
    <div
      className={`flex w-full ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
    >
      <div
        className={`max-w-[70%] rounded-2xl p-3 ${
          isCurrentUser
            ? isEmojiOnly 
              ? 'bg-transparent'
              : 'bg-primary text-white rounded-br-none'
            : isEmojiOnly
              ? 'bg-transparent'
              : 'bg-gray-100 text-gray-800 rounded-bl-none border border-gray-200'
        }`}
      >
          <EmojiConverter text={message.message} />
        {!isEmojiOnly && (
          <p className={`text-md mt-1 ${
            isCurrentUser
              ? 'text-white/70'
              : 'text-gray-500'
          }`}>
            {new Date(message.timestamp).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit'
            })}
          </p>
        )}
      </div>
    </div>
  );
} 