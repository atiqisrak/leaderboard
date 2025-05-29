import { useState, useEffect } from "react";

export default function FeedActions({ feed, user, onDelete, onEdit, onShare }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".dropdown-container")) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  if (!user || (user.id !== feed?.author?.id && user.role !== "admin")) {
    return null;
  }

  return (
    <div className="ml-auto relative dropdown-container">
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="p-2 text-[#b0b3b8] hover:text-white transition-colors"
      >
        <svg
          className="w-5 h-5"
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
        <div className="absolute right-0 mt-2 w-48 bg-secondary rounded-lg shadow-lg py-1 z-10">
          <button
            onClick={() => {
              onEdit(feed);
              setIsDropdownOpen(false);
            }}
            className="w-full px-4 py-2 text-left text-[#b0b3b8] hover:bg-[#23262b] hover:text-white transition-colors"
          >
            Edit
          </button>
          <button
            onClick={() => {
              onShare(feed);
              setIsDropdownOpen(false);
            }}
            className="w-full px-4 py-2 text-left text-[#b0b3b8] hover:bg-[#23262b] hover:text-white transition-colors"
          >
            Share
          </button>
          <button
            onClick={() => {
              onDelete(feed.id);
              setIsDropdownOpen(false);
            }}
            className="w-full px-4 py-2 text-left text-red-500 hover:bg-[#23262b] hover:text-red-400 transition-colors"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}
