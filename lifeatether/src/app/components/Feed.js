"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import FeedItem from "./feed/FeedItem";
import DeleteFeedModal from "./feed/DeleteFeedModal";
import EditFeedModal from "./feed/EditFeedModal";

export default function Feed() {
  const [feeds, setFeeds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [feedToDelete, setFeedToDelete] = useState(null);
  const [feedToEdit, setFeedToEdit] = useState(null);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    fetchFeeds();
  }, []);

  const fetchFeeds = async () => {
    try {
      const response = await fetch("/api/feeds", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.access_token}`,
        },
      });
      const data = await response.json();

      if (data.success) {
        setFeeds(data.feeds);
      } else {
        setError(data.message || "Failed to fetch feeds");
      }
    } catch (error) {
      console.error("Error fetching feeds:", error);
      setError("Failed to fetch feeds");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (feedId) => {
    try {
      const response = await fetch(`/api/feeds/${feedId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${user?.access_token}`,
        },
      });
      const data = await response.json();

      if (data.success) {
        setFeeds(feeds.filter((feed) => feed.id !== feedId));
        setDeleteModalOpen(false);
        setFeedToDelete(null);
      } else {
        setError(data.message || "Failed to delete feed");
      }
    } catch (error) {
      console.error("Error deleting feed:", error);
      setError("Failed to delete feed");
    }
  };

  const handleDeleteClick = (feed) => {
    setFeedToDelete(feed);
    setDeleteModalOpen(true);
  };

  const handleEdit = (feed) => {
    setFeedToEdit({
      id: feed.id,
      title: feed.title,
      content: feed.content,
      author: feed.author
    });
    setEditModalOpen(true);
  };

  const handleEditSave = (updatedFeed) => {
    setFeeds(feeds.map((feed) =>
      feed.id === updatedFeed.id ? updatedFeed : feed
    ));
  };

  const handleShare = (feed) => {
    // TODO: Implement share functionality
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 py-4">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-2 py-8">
      <div className="space-y-6">
        {feeds.map((feed) => (
          <FeedItem
            key={feed.id}
            feed={feed}
            user={user}
            onDelete={() => handleDeleteClick(feed)}
            onEdit={() => handleEdit(feed)}
            onShare={handleShare}
          />
        ))}
      </div>

      <DeleteFeedModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setFeedToDelete(null);
        }}
        onConfirm={() => handleDelete(feedToDelete?.id)}
        feedTitle={feedToDelete?.title}
      />

      <EditFeedModal
        isOpen={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setFeedToEdit(null);
        }}
        onSave={handleEditSave}
        feed={feedToEdit}
      />
    </div>
  );
}
