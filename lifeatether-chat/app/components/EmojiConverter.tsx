"use client";

interface EmojiConverterProps {
  text: string;
}

const emojiMap: { [key: string]: string } = {
  ':-)': '😊',
  ':)': '😊',
  ':-D': '😃',
  ':D': '😃',
  ':-(': '😢',
  ':(': '😢',
  ':-P': '😛',
  ':-p': '😛',
  ':P': '😛',
  ':p': '😛',
  ':-|': '😐',
  ':|': '😐',
  ':-O': '😮',
  ':-o': '😮',
  ':O': '😮',
  ':o': '😮',
  ':-*': '😘',
  ':*': '😘',
  ':-/': '😕',
  ':/': '😕',
  ':-\\': '😕',
  ':\\': '😕',
  ':-$': '😳',
  ':$': '😳',
};

export default function EmojiConverter({ text }: EmojiConverterProps) {
  let convertedText = text;

  // Convert text emoticons to emojis
  Object.entries(emojiMap).forEach(([emoticon, emoji]) => {
    // Escape special characters for regex
    const escapedEmoticon = emoticon.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    // Use regex to match whole words or emoticons, case-insensitive
    const regex = new RegExp(`\\b${escapedEmoticon}\\b|${escapedEmoticon}`, 'gi');
    convertedText = convertedText.replace(regex, emoji);
  });

  return (
    <span className="text-md">{convertedText}</span>
  );
} 