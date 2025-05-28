"use client";

import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";

export default function CommentForm({
  feedId,
  parentCommentId = null,
  onSubmit,
  onCancel,
}) {
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const { user } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!user) {
      router.push("/login");
      return;
    }

    if (!content.trim()) {
      setError("Please enter a comment");
      return;
    }

    try {
      // Create payload with only the necessary fields
      const payload = {
        content,
        feed_id: feedId,
      };

      // Only add parent_comment_id if it's provided
      if (parentCommentId) {
        payload.parent_comment_id = parentCommentId;
      }

      const response = await fetch("/api/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.access_token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (data.success) {
        onSubmit(content);
        setContent("");
      } else {
        setError(data.message || "Failed to post comment");
      }
    } catch (error) {
      console.error("Error posting comment:", error);
      setError("Failed to post comment");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Write a comment..."
        className="w-full px-4 py-2 bg-[#23262b] border border-[#FCB813]/20 rounded-lg text-white focus:outline-none focus:border-[#FCB813] h-24 resize-none"
      />
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <div className="flex justify-end gap-2">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-[#b0b3b8] hover:text-white transition-colors"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          className="px-4 py-2 bg-[#FCB813] text-[#181b20] rounded-lg font-semibold hover:bg-[#ffd34d] transition-colors"
        >
          {parentCommentId ? "Reply" : "Comment"}
        </button>
      </div>
    </form>
  );
}
