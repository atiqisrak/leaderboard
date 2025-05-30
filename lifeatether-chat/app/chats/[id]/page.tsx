"use client";
import { useParams, useRouter } from "next/navigation";
import { useChat } from "../../context/ChatContext";
import { useState, useEffect, useRef } from "react";
import { setTypingStatus } from "../../../lib/socket";

interface Message {
  from: "me" | "them";
  text: string;
  time: string;
  userId: string;
}

export default function ChatPage() {
  const params = useParams();
  const id = params.id as string;
  const chatContext = useChat();
  if (!chatContext) return null;
  const { messages, sendMessage, isTyping } = chatContext;
  const [input, setInput] = useState("");
  const router = useRouter();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages[id]]);

  // Handle typing status
  const handleTyping = () => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    setTypingStatus(id, "user123", true); // TODO: Replace with actual user ID

    typingTimeoutRef.current = setTimeout(() => {
      setTypingStatus(id, "user123", false);
    }, 2000);
  };

  const handleSend = () => {
    if (input.trim()) {
      sendMessage(id, { 
        from: "me" as const, 
        text: input, 
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        userId: "user123" // TODO: Replace with actual user ID
      });
      setInput("");
      setTypingStatus(id, "user123", false);
    }
  };

  const chatMessages = messages[id] || [];

  return (
    <div className="min-h-screen bg-[var(--background)] flex flex-col items-center py-10">
      <div className="navigation flex items-center justify-between w-full">
        <button className="text-white" onClick={() => router.back()}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-left"><path d="M19 12H5"/><path d="M12 19L5 12L12 5"/></svg>
        </button>
        <div className="flex items-center gap-2">
          <button className="text-white">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-phone"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3H9a5 5 0 0 1 5-5V4a3 3 0 0 0-3-3"/></svg>
          </button>
          <button className="text-white">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-video"><path d="M23 7l-7 5 7 5V7z"/><path d="M1 12h15v7L1 19V12z"/></svg>
          </button>
          <button className="text-white">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-more-horizontal"><path d="M10 10h4"/><path d="M10 14h4"/><path d="M10 18h4"/></svg>
          </button>
        </div>
      </div>
      <div className="w-96 bg-[var(--card-bg)] rounded-2xl shadow-lg flex flex-col h-[80vh]">
        <div className="p-4 border-b border-[var(--section-bg)] flex items-center gap-4">
          <img src="/avatars/1.png" className="w-10 h-10 rounded-full" />
          <div>
            <div className="font-semibold">Shawn Jones</div>
            <div className="text-xs text-[var(--light-text)]">
              {isTyping["user123"] ? "Typing..." : "Online"}
            </div>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {chatMessages.map((msg, i) => (
            <div key={i} className={`flex ${msg.from === "me" ? "justify-end" : "justify-start"}`}>
              <div className={`px-4 py-2 rounded-2xl ${msg.from === "me" ? "bg-[var(--primary-color)] text-[var(--background)]" : "bg-[var(--section-bg)] text-[var(--text-color)]"}`}>
                {msg.text}
                <div className="text-xs mt-1 opacity-70">{msg.time}</div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <div className="p-4 border-t border-[var(--section-bg)] flex gap-2">
          <input
            className="flex-1 px-4 py-2 rounded-full bg-[var(--section-bg)] text-[var(--text-color)]"
            value={input}
            onChange={e => {
              setInput(e.target.value);
              handleTyping();
            }}
            placeholder="Type a message…"
            onKeyDown={e => e.key === "Enter" && handleSend()}
          />
          <button
            className="bg-[var(--primary-color)] text-[var(--background)] rounded-full px-4 py-2 font-bold"
            onClick={handleSend}
          >
            ➤
          </button>
        </div>
      </div>
    </div>
  );
}
