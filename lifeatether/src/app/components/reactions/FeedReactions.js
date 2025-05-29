"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import Image from "next/image";

const REACTION_TYPES = ["like", "love", "haha", "wow", "angry"];

export default function FeedReactions({ feedId }) {
  const [reactions, setReactions] = useState([]);
  const [reactionCounts, setReactionCounts] = useState({});
  const [userReaction, setUserReaction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user } = useAuth();

  useEffect(() => {
    if (feedId) {
      fetchReactions();
    }
  }, [feedId]);

  const fetchReactions = async () => {
    try {
      const response = await fetch(`/api/feed-reactions/feed/${feedId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.access_token}`,
        },
      });
      const data = await response.json();

      if (data.success) {
        // Get only the latest reaction for each user
        const latestReactions = data.reactions.reduce((acc, reaction) => {
          const existingReaction = acc.find(
            (r) => r.user_id === reaction.user_id
          );
          if (
            !existingReaction ||
            new Date(reaction.createdAt) > new Date(existingReaction.createdAt)
          ) {
            return [
              ...acc.filter((r) => r.user_id !== reaction.user_id),
              reaction,
            ];
          }
          return acc;
        }, []);

        setReactions(latestReactions);

        // Calculate counts from latest reactions
        const counts = latestReactions.reduce((acc, reaction) => {
          acc[reaction.reaction_type] = (acc[reaction.reaction_type] || 0) + 1;
          return acc;
        }, {});
        setReactionCounts(counts);

        // Find user's latest reaction if any
        const userReaction = latestReactions.find(
          (reaction) => reaction.user_id === user?.id
        );
        setUserReaction(userReaction?.reaction_type || null);
      } else {
        setError(data.message || "Failed to fetch reactions");
      }
    } catch (error) {
      console.error("Error fetching reactions:", error);
      setError("Failed to fetch reactions");
    } finally {
      setLoading(false);
    }
  };

  const handleReaction = async (reactionType) => {
    if (!user) return;

    try {
      // If user already reacted with this type, remove the reaction
      if (userReaction === reactionType) {
        const response = await fetch(`/api/feed-reactions/${feedId}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${user.access_token}`,
          },
        });
        const data = await response.json();

        if (data.success) {
          setUserReaction(null);
          fetchReactions();
        }
        return;
      }

      // If user has an existing reaction, update it
      if (userReaction) {
        const response = await fetch(`/api/feed-reactions/${feedId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.access_token}`,
          },
          body: JSON.stringify({
            feed_id: feedId,
            reaction_type: reactionType,
          }),
        });
        const data = await response.json();

        if (data.success) {
          setUserReaction(reactionType);
          fetchReactions();
        } else {
          setError(data.message || "Failed to update reaction");
        }
        return;
      }

      // If user has no existing reaction, create a new one
      const response = await fetch("/api/feed-reactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.access_token}`,
        },
        body: JSON.stringify({
          feed_id: feedId,
          reaction_type: reactionType,
        }),
      });
      const data = await response.json();

      if (data.success) {
        setUserReaction(reactionType);
        fetchReactions();
      } else {
        setError(data.message || "Failed to add reaction");
      }
    } catch (error) {
      console.error("Error handling reaction:", error);
      setError("Failed to handle reaction");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-2">
        <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 py-2">
      {REACTION_TYPES.map((type) => (
        <button
          key={type}
          onClick={() => handleReaction(type)}
          className={`relative group flex items-center gap-1 px-2 py-1 rounded-full transition-colors ${
            userReaction === type ? "bg-primary/20" : "hover:bg-[#23262b]"
          }`}
        >
          <Image
            src={`/reactions/${type}.svg`}
            alt={type}
            width={30}
            height={30}
            className={`transition-transform group-hover:scale-110 ${
              userReaction === type ? "scale-110" : ""
            }`}
          />
          {/* {reactionCounts[type] > 0 && (
            <span className="text-sm font-medium text-[#b0b3b8] min-w-[20px] text-center">
              {reactionCounts[type]}
            </span>
          )} */}
        </button>
      ))}
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
}
