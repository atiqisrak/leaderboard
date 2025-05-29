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
import FeedReactions from "../reactions/FeedReactions";
import FeedMetrics from "./FeedMetrics";

export default function FeedItem({ feed, user, onDelete, onEdit, onShare }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showCommentBox, setShowCommentBox] = useState(false);
  const [showAllComments, setShowAllComments] = useState(false);
  const [showFullContent, setShowFullContent] = useState(false);
  const [openDropdownId, setOpenDropdownId] = useState(null);

  useEffect(() => {
    fetchComments();
  }, [feed.id]);

  // Add click outside handler to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".comment-actions")) {
        setOpenDropdownId(null);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

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
      await fetchComments();
      setShowCommentBox(false); // Hide comment box after successful submission
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
        fetchComments();
      } else {
        setError(data.message || "Failed to delete comment");
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
      setError("Failed to delete comment");
    }
  };

  // Get the last comment if not showing all comments
  const displayedComments = showAllComments ? comments : comments.slice(-1);

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

      {/* Feed Content with Read More */}
      <div className="mb-4">
        <div className="flex flex-col gap-4">
          {feed.title && (
            <h3 className="text-white font-semibold">{feed.title}</h3>
          )}
          <p className="text-[#b0b3b8] whitespace-pre-wrap">
            {showFullContent ? feed.content : feed.content.slice(0, 200)}
            {feed.content.length > 200 && (
              <button
                onClick={() => setShowFullContent(!showFullContent)}
                className="text-primary hover:text-[#ffd34d] ml-2"
              >
                {showFullContent ? "Show less" : "Read more..."}
              </button>
            )}
          </p>
        </div>
      </div>
      <FeedMetrics feedId={feed.id} />
      {/* Reactions Section */}
      <FeedReactions feedId={feed.id} />

      {/* Comments Section */}
      <div className="mt-6 border-t border-primary/10 pt-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-white">Comments</h3>
          <button
            onClick={() => setShowCommentBox(!showCommentBox)}
            className="px-4 py-2 bg-primary text-[#181b20] rounded-lg font-semibold hover:bg-[#ffd34d] transition-colors"
          >
            {showCommentBox ? "Cancel" : "Comment"}
          </button>
        </div>

        {showCommentBox && (
          <CommentForm
            feedId={feed.id}
            onSubmit={(content) => handleComment(content)}
          />
        )}

        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

        {loading ? (
          <div className="flex justify-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <>
            <div className="mt-6 space-y-6">
              {displayedComments.map((comment) => (
                <CommentCard
                  key={comment.id}
                  comment={comment}
                  user={user}
                  onReply={handleComment}
                  onDelete={handleDeleteComment}
                  openDropdownId={openDropdownId}
                  setOpenDropdownId={setOpenDropdownId}
                />
              ))}
            </div>

            {comments.length > 1 && (
              <button
                onClick={() => setShowAllComments(!showAllComments)}
                className="mt-4 text-primary hover:text-[#ffd34d] font-medium"
              >
                {showAllComments
                  ? "Show less comments"
                  : `Show all comments (${comments.length})`}
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
