"use client";

import { useState } from "react";

export default function CreatePostModal({ isOpen, onClose, onSubmit }) {
  const [newPost, setNewPost] = useState({ title: "", content: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(newPost);
    setNewPost({ title: "", content: "" });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-[#23262b] rounded-2xl p-6 w-full max-w-lg transform transition-all">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-[#FCB813]">What's Up!</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              placeholder="Give it a title..."
              value={newPost.title}
              onChange={(e) =>
                setNewPost({ ...newPost, title: e.target.value })
              }
              className="w-full px-4 py-3 bg-[#181b20] border border-[#FCB813]/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#FCB813] transition-colors"
              required
            />
          </div>
          <div>
            <textarea
              placeholder="Share your thoughts..."
              value={newPost.content}
              onChange={(e) =>
                setNewPost({ ...newPost, content: e.target.value })
              }
              className="w-full px-4 py-3 bg-[#181b20] border border-[#FCB813]/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#FCB813] transition-colors h-32 resize-none"
              required
            />
          </div>
          <div className="flex justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 text-gray-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-[#FCB813] text-[#181b20] rounded-lg font-semibold hover:bg-[#ffd34d] transition-all hover:-translate-y-0.5 shadow-lg"
            >
              Share
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
