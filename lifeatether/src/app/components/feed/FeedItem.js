"use client";

import { useState, useEffect } from "react";
import { formatDistanceToNow } from "date-fns";
import Image from "next/image";
import { useAuth } from "../../context/AuthContext";
import CommentCard from "../comments/CommentCard";
import CommentForm from "../comments/CommentForm";
import FeedHeader from "./FeedHeader";
import FeedContent from "./FeedContent";
import FeedActions from "./FeedActions";

export default function FeedItem({ feed, user, onDelete, onEdit, onShare }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchComments();
  }, [feed.id]);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/comments/feed/${feed.id}`, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();

      if (data.success) {
        setComments(data.comments);
      } else {
        setError(data.message || "Failed to fetch comments");
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
      setError("Failed to fetch comments");
    } finally {
      setLoading(false);
    }
  };

  const handleComment = async (content, parentCommentId = null) => {
    try {
      // Just refresh the comments after a successful submission
      await fetchComments();
    } catch (error) {
      console.error("Error refreshing comments:", error);
      setError("Failed to refresh comments");
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const response = await fetch(`/api/comments/${commentId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${user?.access_token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        fetchComments(); // Refresh comments after deletion
      } else {
        setError(data.message || "Failed to delete comment");
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
      setError("Failed to delete comment");
    }
  };

  return (
    <div className="bg-[#23262b] rounded-xl p-6 shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <FeedHeader feed={feed} user={user} />
        <FeedActions
          feed={feed}
          user={user}
          onDelete={onDelete}
          onEdit={onEdit}
          onShare={onShare}
        />
      </div>
      <FeedContent feed={feed} />

      {/* Comments Section */}
      <div className="mt-6 border-t border-[#FCB813]/10 pt-6">
        <h3 className="text-lg font-semibold text-white mb-4">Comments</h3>
        <CommentForm
          feedId={feed.id}
          onSubmit={(content) => handleComment(content)}
        />
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        {loading ? (
          <div className="flex justify-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-[#FCB813]"></div>
          </div>
        ) : (
          <div className="mt-6 space-y-6">
            {comments.map((comment) => (
              <CommentCard
                key={comment.id}
                comment={comment}
                user={user}
                onReply={handleComment}
                onDelete={handleDeleteComment}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
