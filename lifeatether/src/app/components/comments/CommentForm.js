"use client";

import { useState, useRef } from "react";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";
import MentionPicker from "../common/MentionPicker";

export default function CommentForm({
  feedId,
  parentCommentId = null,
  onSubmit,
  onCancel,
}) {
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [showMentionPicker, setShowMentionPicker] = useState(false);
  const [mentionPosition, setMentionPosition] = useState({ top: 0, left: 0 });
  const [mentionedUsers, setMentionedUsers] = useState([]);
  const contentRef = useRef(null);
  const { user } = useAuth();
  const router = useRouter();

  const createMentions = async (commentId) => {
    try {
      // Create mentions for each mentioned user
      const mentionPromises = mentionedUsers.map(async (mentionedUser) => {
        const response = await fetch("/api/mentions/comment", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.access_token}`,
          },
          body: JSON.stringify({
            comment_id: commentId,
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
      // Don't throw here, as the comment was already created
    }
  };

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
      const payload = {
        content,
        feed_id: feedId,
      };

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
        // Create mentions if there are any mentioned users
        if (mentionedUsers.length > 0) {
          await createMentions(data.comment.id);
        }

        onSubmit(content);
        setContent("");
        setMentionedUsers([]);
      } else {
        setError(data.message || "Failed to post comment");
      }
    } catch (error) {
      console.error("Error posting comment:", error);
      setError("Failed to post comment");
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

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <div className="relative">
        <textarea
          ref={contentRef}
          value={content}
          onChange={handleContentChange}
          onKeyDown={handleKeyDown}
          placeholder="Write a comment..."
          className="w-full px-4 py-2 bg-[#23262b] border border-primary/20 rounded-lg text-white focus:outline-none focus:border-primary h-24 resize-none"
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
          className="px-4 py-2 bg-primary text-secondary rounded-lg font-semibold hover:bg-[#ffd34d] transition-colors"
        >
          {parentCommentId ? "Reply" : "Comment"}
        </button>
      </div>
    </form>
  );
}
