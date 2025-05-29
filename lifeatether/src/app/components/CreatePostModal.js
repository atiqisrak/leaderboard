"use client";

import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function CreatePostModal({ isOpen, onClose, onSubmit }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const { user } = useAuth();

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
        onSubmit(data.feed);
        setTitle("");
        setContent("");
        onClose();
      } else {
        setError(data.message || "Failed to create post");
      }
    } catch (error) {
      console.error("Error creating post:", error);
      setError("Failed to create post");
    }
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
          <div>
            <label
              htmlFor="content"
              className="block text-sm font-medium text-[#b0b3b8] mb-1"
            >
              Content
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-4 py-2 bg-secondary border border-primary/20 rounded-lg text-white focus:outline-none focus:border-primary h-32 resize-none"
              required
            />
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
