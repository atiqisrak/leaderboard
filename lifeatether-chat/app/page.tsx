"use client";
import { useRouter } from "next/navigation";
import { useChat } from "./context/ChatContext";
import { useEffect } from "react";
import UserList from "./components/UserList";

export default function ChatListPage() {
  const router = useRouter();
  const chatContext = useChat();
  if (!chatContext) return null;

  // Check authentication
  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    if (!token || !user.id) {
      router.push('/login');
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--text-color)] flex flex-col items-center py-10">
      <h1 className="text-2xl font-bold mb-6">Chat with Users 👋</h1>
      <input
        className="w-80 px-4 py-2 rounded bg-[var(--section-bg)] text-[var(--light-text)] mb-6"
        placeholder="Search users..."
      />
      <UserList />
    </div>
  );
}
