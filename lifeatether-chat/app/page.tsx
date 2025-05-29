"use client";
import { useRouter } from "next/navigation";
import { useChat } from "./context/ChatContext";

const chats = [
  { id: "1", name: "Shawn Jones", last: "I love them! 🔥", time: "09:38 AM", avatar: "/avatars/1.png" },
  { id: "2", name: "Dianne Russell", last: "Dianne is typing...", time: "09:20 AM", avatar: "/avatars/2.png" },
  {
    id: "3",
    name: "Jenny Wilson",
    last: "Jenny is typing...",
    time: "09:10 AM",
    avatar: "/avatars/3.png"
  },
  {
    id: "4",
    name: "Leslie Alexande",
    last: "Leslie is typing...",
    time: "09:00 AM",
    avatar: "/avatars/4.png"
  }
];

export default function ChatListPage() {
  const router = useRouter();
  const chatContext = useChat();
  if (!chatContext) return null;

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--text-color)] flex flex-col items-center py-10">
      <h1 className="text-2xl font-bold mb-6">Hello User 👋</h1>
      <input
        className="w-80 px-4 py-2 rounded bg-[var(--section-bg)] text-[var(--light-text)] mb-6"
        placeholder="Search"
      />
      <div className="w-80 bg-[var(--card-bg)] rounded-2xl shadow-lg">
        {chats.map((chat) => (
          <div
            key={chat.id}
            className="flex items-center gap-4 px-4 py-3 border-b border-[var(--section-bg)] cursor-pointer hover:bg-[var(--section-bg)] transition"
            onClick={() => {
              chatContext.selectChat(chat.id);
              router.push(`/chats/${chat.id}`);
            }}
          >
            <img src={chat.avatar} alt={chat.name} className="w-10 h-10 rounded-full" />
            <div className="flex-1">
              <div className="font-semibold">{chat.name}</div>
              <div className="text-sm text-[var(--light-text)]">{chat.last}</div>
            </div>
            <div className="text-xs text-[var(--light-text)]">{chat.time}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
