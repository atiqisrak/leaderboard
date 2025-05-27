"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { formatDistanceToNow } from "date-fns";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Feed() {
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newPost, setNewPost] = useState({ title: "", content: "" });
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [postsRes, usersRes] = await Promise.all([
          fetch("/api/feed"),
          fetch("/api/users"),
        ]);
        const [postsData, usersData] = await Promise.all([
          postsRes.json(),
          usersRes.json(),
        ]);
        setPosts(postsData);
        setUsers(usersData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSharePost = () => {
    if (!user) {
      router.push("/login");
      return;
    }
    setShowModal(true);
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!newPost.title.trim() || !newPost.content.trim()) return;

    try {
      const response = await fetch("/api/feed", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...newPost,
          authorId: user.id,
        }),
      });

      if (response.ok) {
        const createdPost = await response.json();
        setPosts([createdPost, ...posts]);
        setNewPost({ title: "", content: "" });
        setShowModal(false);
      }
    } catch (error) {
      console.error("Error creating post:", error);
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
        const data = await response.json();
        const updatedPosts = posts.map((post) =>
          post.id === postId
            ? {
                ...post,
                reactions: data.reactions,
              }
            : post
        );
        setPosts(updatedPosts);
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
        const data = await response.json();
        const updatedPosts = posts.map((post) =>
          post.id === postId
            ? {
                ...post,
                comments: data.comments,
              }
            : post
        );
        setPosts(updatedPosts);
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const getUserInfo = (userId) => {
    return (
      users.find((u) => u.id === userId) || {
        name: "Unknown User",
        avatar: "/default-avatar.png",
      }
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 rounded-lg p-6 w-full max-w-lg">
            <h2 className="text-2xl font-bold mb-4">Create New Post</h2>
            <form onSubmit={handleCreatePost}>
              <div className="mb-4">
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  value={newPost.title}
                  onChange={(e) =>
                    setNewPost({ ...newPost, title: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="content"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Content
                </label>
                <textarea
                  id="content"
                  value={newPost.content}
                  onChange={(e) =>
                    setNewPost({ ...newPost, content: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 h-32"
                  required
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-yellow-500 text-black rounded-md hover:bg-yellow-600"
                >
                  Post
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="space-y-6">
        {posts.map((post) => {
          const author = getUserInfo(post.authorId);
          return (
            <div
              key={post.id}
              className="bg-gray-600 rounded-lg shadow-md p-6 space-y-4"
            >
              <div className="flex items-center space-x-4">
                <div className="relative w-12 h-12">
                  <Image
                    src={author.avatar}
                    alt={author.name}
                    fill
                    className="rounded-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{author.name}</h3>
                  <p className="text-gray-500 text-sm">
                    {formatDistanceToNow(new Date(post.createdAt), {
                      addSuffix: true,
                    })}
                  </p>
                </div>
              </div>

              {post.title && (
                <h4 className="text-xl font-semibold text-primary">
                  {post.title}
                </h4>
              )}
              <p className="text-white">{post.content}</p>

              <div className="flex items-center space-x-4 border-t border-[#FCB813]/20 pt-4">
                <button
                  onClick={() => handleReaction(post.id, "like")}
                  className={`flex items-center space-x-1 ${
                    post.reactions?.some(
                      (r) => r.userId === user?.id && r.type === "like"
                    )
                      ? "text-[#FCB813]"
                      : "text-[#b0b3b8] hover:text-[#FCB813]"
                  }`}
                >
                  <span>👍</span>
                  <span>
                    {post.reactions?.filter((r) => r.type === "like").length ||
                      0}
                  </span>
                </button>
                <button
                  onClick={() => handleReaction(post.id, "love")}
                  className={`flex items-center space-x-1 ${
                    post.reactions?.some(
                      (r) => r.userId === user?.id && r.type === "love"
                    )
                      ? "text-[#FCB813]"
                      : "text-[#b0b3b8] hover:text-[#FCB813]"
                  }`}
                >
                  <span>❤️</span>
                  <span>
                    {post.reactions?.filter((r) => r.type === "love").length ||
                      0}
                  </span>
                </button>
                <button
                  onClick={() => handleReaction(post.id, "laugh")}
                  className={`flex items-center space-x-1 ${
                    post.reactions?.some(
                      (r) => r.userId === user?.id && r.type === "laugh"
                    )
                      ? "text-[#FCB813]"
                      : "text-[#b0b3b8] hover:text-[#FCB813]"
                  }`}
                >
                  <span>😄</span>
                  <span>
                    {post.reactions?.filter((r) => r.type === "laugh").length ||
                      0}
                  </span>
                </button>
              </div>
              <div className="mt-4">
                <h4 className="font-semibold text-[#FCB813] mb-2">
                  Comments ({post.comments?.length || 0})
                </h4>
                {post.comments?.map((comment) => (
                  <div
                    key={comment.id}
                    className="bg-[#181b20] rounded-lg p-3 mb-2"
                  >
                    <div className="flex items-center mb-2">
                      <img
                        src={getUserInfo(comment.userId).avatar}
                        alt={getUserInfo(comment.userId).name}
                        className="w-6 h-6 rounded-full mr-2"
                      />
                      <span className="font-medium text-[#FCB813]">
                        {getUserInfo(comment.userId).name}
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
                {user ? (
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
                ) : (
                  <div className="mt-4 text-center">
                    <button
                      onClick={() => router.push("/auth/login")}
                      className="text-[#FCB813] hover:text-[#ffd34d]"
                    >
                      Login to comment
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
