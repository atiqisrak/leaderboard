"use client";
import { useState } from 'react';

interface EmojiBoxProps {
  onEmojiSelect: (emoji: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

const COMMON_EMOJIS = [
  '😊', '😂', '❤️', '👍', '🎉',
  '🙏', '😍', '😭', '😎', '🤔',
  '😡', '😴', '🥳', '🤗', '😇',
  '🤣', '😘', '😢', '😤', '🤩'
];

export default function EmojiBox({ onEmojiSelect, isOpen, onClose }: EmojiBoxProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed bottom-24 left-0 right-0 bg-[var(--card-bg)] border-t border-[var(--border-color)] p-4 shadow-lg">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Emojis</h3>
          <button 
            onClick={onClose}
            className="text-[var(--text-color)] hover:text-[var(--primary-color)]"
          >
            ✕
          </button>
        </div>
        <div className="grid grid-cols-8 gap-2">
          {COMMON_EMOJIS.map((emoji, index) => (
            <button
              key={index}
              onClick={() => onEmojiSelect(emoji)}
              className="text-2xl p-2 hover:bg-[var(--section-bg)] rounded-lg transition-colors"
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
