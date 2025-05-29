"use client";

import { useState, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import MentionPicker from "./common/MentionPicker";

export default function CreatePostModal({ isOpen, onClose, onSubmit }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [showMentionPicker, setShowMentionPicker] = useState(false);
  const [mentionPosition, setMentionPosition] = useState({ top: 0, left: 0 });
  const [mentionedUsers, setMentionedUsers] = useState([]);
  const contentRef = useRef(null);
  const { user } = useAuth();

  const createMentions = async (feedId) => {
    try {
      // Create mentions for each mentioned user
      const mentionPromises = mentionedUsers.map(async (mentionedUser) => {
        const response = await fetch("/api/mentions/feed", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user?.access_token}`,
          },
          body: JSON.stringify({
            feed_id: feedId,
            mentioned_user_id: mentionedUser.id,
          }),
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.message || "Failed to create mention");
        }

        return response.json();
      });

      await Promise.all(mentionPromises);
    } catch (error) {
      console.error("Error creating mentions:", error);
      // Don't throw here, as the feed was already created
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!title.trim() || !content.trim()) {
      setError("Please fill in all fields");
      return;
    }

    try {
      const response = await fetch("/api/feeds", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.access_token}`,
        },
        body: JSON.stringify({ title, content }),
      });

      const data = await response.json();

      if (data.success) {
        // Create mentions if there are any mentioned users
        if (mentionedUsers.length > 0) {
          await createMentions(data.feed.id);
        }

        onSubmit(data.feed);
        setTitle("");
        setContent("");
        setMentionedUsers([]);
        onClose();
      } else {
        setError(data.message || "Failed to create post");
      }
    } catch (error) {
      console.error("Error creating post:", error);
      setError("Failed to create post");
    }
  };

  const handleContentChange = (e) => {
    const value = e.target.value;
    setContent(value);

    // Check if user typed @
    const lastAtSymbol = value.lastIndexOf("@");
    if (lastAtSymbol !== -1) {
      const textAfterAt = value.slice(lastAtSymbol + 1);
      if (!textAfterAt.includes(" ")) {
        const rect = e.target.getBoundingClientRect();
        const textBeforeCursor = value.slice(0, e.target.selectionStart);
        const lines = textBeforeCursor.split("\n");
        const lineHeight = parseInt(getComputedStyle(e.target).lineHeight);

        setMentionPosition({
          top: rect.top + (lines.length - 1) * lineHeight,
          left: rect.left + (lastAtSymbol * 8) // Approximate character width
        });
        setShowMentionPicker(true);
        return;
      }
    }
    setShowMentionPicker(false);
  };

  const handleMentionSelect = (selectedUser) => {
    const lastAtSymbol = content.lastIndexOf("@");
    const newContent = content.slice(0, lastAtSymbol) + `@${selectedUser.name} ` + content.slice(lastAtSymbol + 1);
    setContent(newContent);
    setMentionedUsers([...mentionedUsers, selectedUser]);
    setShowMentionPicker(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[#23262b] p-8 rounded-2xl w-full max-w-md">
        <h2 className="text-2xl font-bold text-white mb-6">Create New Post</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-[#b0b3b8] mb-1"
            >
              Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 bg-secondary border border-primary/20 rounded-lg text-white focus:outline-none focus:border-primary"
              required
            />
          </div>
          <div className="relative">
            <label
              htmlFor="content"
              className="block text-sm font-medium text-[#b0b3b8] mb-1"
            >
              Content
            </label>
            <textarea
              id="content"
              ref={contentRef}
              value={content}
              onChange={handleContentChange}
              className="w-full px-4 py-2 bg-secondary border border-primary/20 rounded-lg text-white focus:outline-none focus:border-primary h-32 resize-none"
              required
            />
            {showMentionPicker && (
              <div
                style={{
                  position: "fixed",
                  top: mentionPosition.top,
                  left: mentionPosition.left,
                }}
              >
                <MentionPicker
                  onSelect={handleMentionSelect}
                  onClose={() => setShowMentionPicker(false)}
                />
              </div>
            )}
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-[#b0b3b8] hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-secondary rounded-lg font-semibold hover:bg-[#ffd34d] transition-colors"
            >
              Post
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
