"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useChat } from '../../context/ChatContext';

export default function ChatPage({ params }: { params: { id: string } }) {
  const [message, setMessage] = useState('');
  const router = useRouter();
  const chatContext = useChat();
  if (!chatContext) return null;

  const { messages, sendMessage, joinRoom, leaveRoom, isLoading, error } = chatContext;

  useEffect(() => {
    // Join the chat room when the component mounts
    joinRoom(params.id);

    // Leave the room when the component unmounts
    return () => {
      leaveRoom();
    };
  }, [params.id]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    sendMessage(message);
    setMessage('');
  };

  return (
    <div className="min-h-screen bg-[var(--background)] flex flex-col">
      {/* Header */}
      <div className="bg-[var(--card-bg)] p-4 flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="text-[var(--text-color)] hover:opacity-80"
        >
          ←
        </button>
        <h1 className="text-xl font-semibold">Chat</h1>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--primary-color)]"></div>
          </div>
        ) : error ? (
          <div className="flex justify-center items-center h-full">
            <div className="text-red-500">{error}</div>
          </div>
        ) : (
          <>
            {messages.length === 0 ? (
              <div className="flex justify-center items-center h-full text-[var(--light-text)]">
                No messages yet. Start the conversation!
              </div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.userId === localStorage.getItem('user') ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[70%] rounded-lg p-3 ${
                      msg.userId === localStorage.getItem('user')
                        ? 'bg-[var(--primary-color)] text-white'
                        : 'bg-[var(--section-bg)] text-[var(--text-color)]'
                    }`}
                  >
                    <p>{msg.message}</p>
                    <span className="text-xs opacity-70">
                      {new Date(msg.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                </div>
              ))
            )}
          </>
        )}
      </div>

      {/* Message Input */}
      <form onSubmit={handleSendMessage} className="p-4 bg-[var(--card-bg)]">
        <div className="flex gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 rounded bg-[var(--section-bg)] text-[var(--text-color)]"
            disabled={isLoading || !!error}
          />
          <button
            type="submit"
            className="bg-[var(--primary-color)] text-white px-6 py-2 rounded hover:opacity-90 disabled:opacity-50"
            disabled={isLoading || !!error}
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}
