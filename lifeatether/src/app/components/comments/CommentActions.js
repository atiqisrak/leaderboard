"use client";

import { useState } from "react";

export default function CommentActions({ comment, user, onReply, onDelete }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  if (!user) return null;

  const canModify = user.id === comment.user_id || user.role === "admin";

  return (
    <div className="relative">
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="p-2 text-[#b0b3b8] hover:text-white transition-colors"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
          />
        </svg>
      </button>
      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-[#181b20] rounded-lg shadow-lg py-1 z-10">
          <button
            onClick={() => {
              onReply();
              setIsDropdownOpen(false);
            }}
            className="w-full px-4 py-2 text-left text-[#b0b3b8] hover:bg-[#23262b] hover:text-white transition-colors"
          >
            Reply
          </button>
          {canModify && (
            <button
              onClick={() => {
                onDelete(comment.id);
                setIsDropdownOpen(false);
              }}
              className="w-full px-4 py-2 text-left text-red-500 hover:bg-[#23262b] hover:text-red-400 transition-colors"
            >
              Delete
            </button>
          )}
        </div>
      )}
    </div>
  );
}
