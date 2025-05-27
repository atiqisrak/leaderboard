"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../app/context/AuthContext";
import { formatDistanceToNow } from "date-fns";
import { useRouter } from "next/navigation";

export default function Feed() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch("/api/feed");
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleReaction = async (postId, type) => {
    if (!user) {
      router.push("/auth/login");
      return;
    }

    try {
      const response = await fetch(`/api/reactions/${postId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ type, userId: user.id }),
      });

      if (response.ok) {
        fetchPosts();
      }
    } catch (error) {
      console.error("Error adding reaction:", error);
    }
  };

  const handleComment = async (postId, content) => {
    if (!user) {
      router.push("/auth/login");
      return;
    }

    try {
      const response = await fetch(`/api/comments/${postId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content, userId: user.id }),
      });

      if (response.ok) {
        fetchPosts();
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const handleSharePost = () => {
    if (!user) {
      router.push("/auth/login");
      return;
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      {posts.map((post) => (
        <div key={post.id} className="bg-[#23262b] rounded-xl p-6 mb-6">
          <div className="flex items-center mb-4">
            <img
              src={post.author.avatar}
              alt={post.author.name}
              className="w-10 h-10 rounded-full mr-3"
            />
            <div>
              <h3 className="font-semibold text-[#FCB813]">
                {post.author.name}
              </h3>
              <p className="text-sm text-[#b0b3b8]">
                {formatDistanceToNow(new Date(post.createdAt), {
                  addSuffix: true,
                })}
              </p>
            </div>
          </div>
          <p className="text-[#b0b3b8] mb-4">{post.content}</p>
          {post.image && (
            <img
              src={post.image}
              alt="Post"
              className="rounded-lg mb-4 w-full"
            />
          )}
          <div className="flex items-center space-x-4 border-t border-[#FCB813]/20 pt-4">
            <button
              onClick={() => handleReaction(post.id, "like")}
              className={`flex items-center space-x-1 ${
                post.reactions.some(
                  (r) => r.userId === user?.id && r.type === "like"
                )
                  ? "text-[#FCB813]"
                  : "text-[#b0b3b8] hover:text-[#FCB813]"
              }`}
            >
              <span>👍</span>
              <span>
                {post.reactions.filter((r) => r.type === "like").length}
              </span>
            </button>
            <button
              onClick={() => handleReaction(post.id, "love")}
              className={`flex items-center space-x-1 ${
                post.reactions.some(
                  (r) => r.userId === user?.id && r.type === "love"
                )
                  ? "text-[#FCB813]"
                  : "text-[#b0b3b8] hover:text-[#FCB813]"
              }`}
            >
              <span>❤️</span>
              <span>
                {post.reactions.filter((r) => r.type === "love").length}
              </span>
            </button>
            <button
              onClick={() => handleReaction(post.id, "laugh")}
              className={`flex items-center space-x-1 ${
                post.reactions.some(
                  (r) => r.userId === user?.id && r.type === "laugh"
                )
                  ? "text-[#FCB813]"
                  : "text-[#b0b3b8] hover:text-[#FCB813]"
              }`}
            >
              <span>😄</span>
              <span>
                {post.reactions.filter((r) => r.type === "laugh").length}
              </span>
            </button>
          </div>
          {user && (
            <div className="mt-4">
              <h4 className="font-semibold text-[#FCB813] mb-2">Comments</h4>
              {post.comments.map((comment) => (
                <div
                  key={comment.id}
                  className="bg-[#181b20] rounded-lg p-3 mb-2"
                >
                  <div className="flex items-center mb-2">
                    <img
                      src={comment.author.avatar}
                      alt={comment.author.name}
                      className="w-6 h-6 rounded-full mr-2"
                    />
                    <span className="font-medium text-[#FCB813]">
                      {comment.author.name}
                    </span>
                    <span className="text-sm text-[#b0b3b8] ml-2">
                      {formatDistanceToNow(new Date(comment.createdAt), {
                        addSuffix: true,
                      })}
                    </span>
                  </div>
                  <p className="text-[#b0b3b8]">{comment.content}</p>
                </div>
              ))}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const content = e.target.comment.value;
                  if (content.trim()) {
                    handleComment(post.id, content);
                    e.target.comment.value = "";
                  }
                }}
                className="mt-4"
              >
                <input
                  type="text"
                  name="comment"
                  placeholder="Write a comment..."
                  className="w-full px-4 py-2 bg-[#181b20] border border-[#FCB813]/20 rounded-lg text-white focus:outline-none focus:border-[#FCB813]"
                />
              </form>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
