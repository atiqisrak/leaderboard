"use client";
import { formatDistanceToNow } from "date-fns";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useFeedReactions } from "../../context/FeedReactionContext";

export default function FeedMetrics({ feedId, user }) {
  const [reactions, setReactions] = useState([]);
  const [reactionsCount, setReactionsCount] = useState(0);
  const [comments, setComments] = useState([]);
  const [commentsCount, setCommentsCount] = useState(0);
  const router = useRouter();
  const { reactionUpdates } = useFeedReactions();

  const fetchReactions = async () => {
    const response = await fetch(`/api/feed-reactions/feed/${feedId}`);
    const data = await response.json();
    setReactions(data);
    setReactionsCount(data.reactions.length);
  };

  const fetchComments = async () => {
    const response = await fetch(`/api/comments/feed/${feedId}`);
    const data = await response.json();
    setComments(data);
    setCommentsCount(data?.comments?.length);
  };

  useEffect(() => {
    fetchReactions();
    fetchComments();
  }, [feedId]);

  // Watch for reaction updates
  useEffect(() => {
    if (reactionUpdates[feedId]) {
      fetchReactions();
    }
  }, [reactionUpdates, feedId]);

  return (
    <div>
      <div className="flex items-center justify-between text-sm font-semibold text-gray-300 mt-2">
        {/* Reactions */}
        <div className="flex items-center gap-1">
          {/* <span>
            {reactionsCount} {reactionsCount === 1 ? "reaction" : "reactions"}
          </span> */}
          <div className="flex items-center gap-1">
            <div className="flex -space-x-1">
              {reactions?.reactions &&
                reactions?.reactions.length > 0 &&
                reactions?.reactions?.map((reaction) => (
                  <div key={reaction.id} className="relative">
                    <Image
                      src={`/reactions/${reaction.reaction_type}.svg`}
                      alt={reaction.reaction_type}
                      width={20}
                      height={20}
                      className="rounded-full border border-[#23262b]"
                    />
                  </div>
                ))}
            </div>
            <span className="text-sm font-medium text-[#b0b3b8]">
              {reactionsCount}
            </span>
          </div>
        </div>
        {/* Comments Counts */}
        <div className="flex items-center gap-1">
          <span>
            {user?.access_token ? (
              <>
                {commentsCount} {commentsCount === 1 ? "comment" : "comments"}
              </>
            ) : (
              <>
                <Link
                  className="text-sm font-medium text-primary"
                  href="/auth/login"
                  onClick={() => router.push("/auth/login")}
                >
                  Login to comment
                </Link>
              </>
            )}
          </span>
        </div>
      </div>
    </div>
  );
}
