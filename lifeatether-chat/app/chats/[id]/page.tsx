"use client";
import { useParams, useRouter } from "next/navigation";
import { useChat } from "../../context/ChatContext";
import { useState } from "react";

interface Message {
  from: "me" | "them";
  text: string;
  time: string;
}

export default function ChatPage() {
  const params = useParams();
  const id = params.id as string;
  const chatContext = useChat();
  if (!chatContext) return null;
  const { messages, sendMessage } = chatContext;
  const [input, setInput] = useState("");
  const router = useRouter();
  const chatMessages = messages[id] || [
    { from: "them" as const, text: "Hey there, do you need any help?", time: "09:32" },
    // ... demo messages
  ];

  const handleSend = () => {
    if (input.trim()) {
      sendMessage(id, { 
        from: "me" as const, 
        text: input, 
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
      });
      setInput("");
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background)] flex flex-col items-center py-10">
        <div className="navigation flex items-center justify-between w-full">
            {/* back button */}
            <button className="text-white" onClick={() => router.back()}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-left"><path d="M19 12H5"/><path d="M12 19L5 12L12 5"/></svg>
            </button>
            {/* call, video call, more options */}
            <div className="flex items-center gap-2">
                <button className="text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-phone"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3H9a5 5 0 0 1 5-5V4a3 3 0 0 0-3-3"/></svg>
                </button>
            </div>
            <div className="flex items-center gap-2">
                <button className="text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-video"><path d="M23 7l-7 5 7 5V7z"/><path d="M1 12h15v7L1 19V12z"/></svg>
                </button>
            </div>
            <div className="flex items-center gap-2">
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
            <div className="text-xs text-[var(--light-text)]">Online</div>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {chatMessages.map((msg, i) => (
            <div key={i} className={`flex ${msg.from === "me" ? "justify-end" : "justify-start"}`}>
              <div className={`px-4 py-2 rounded-2xl ${msg.from === "me" ? "bg-[var(--primary-color)] text-[var(--background)]" : "bg-[var(--section-bg)] text-[var(--text-color)]"}`}>
                {msg.text}
              </div>
            </div>
          ))}
        </div>
        <div className="p-4 border-t border-[var(--section-bg)] flex gap-2">
          <input
            className="flex-1 px-4 py-2 rounded-full bg-[var(--section-bg)] text-[var(--text-color)]"
            value={input}
            onChange={e => setInput(e.target.value)}
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
