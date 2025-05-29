"use client";

import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import Image from "next/image";
import CommentForm from "./CommentForm";
import CommentActions from "./CommentActions";
import CommentReactions from "../reactions/CommentReactions";

export default function CommentCard({
  comment,
  onReply,
  onDelete,
  user,
  openDropdownId,
  setOpenDropdownId,
}) {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [showReplies, setShowReplies] = useState(false);

  const hasReplies = comment.replies && comment.replies.length > 0;

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
          <Image
            src={comment.user.avatar || "/default-avatar.png"}
            alt={comment.user.name}
            fill
            className="object-cover"
          />
        </div>
        <div className="flex-grow">
          <div className="bg-[#181b20] rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <h4 className="text-white font-semibold">
                  {comment.user.name}
                </h4>
                <p className="text-[#b0b3b8] text-sm">
                  {formatDistanceToNow(new Date(comment.createdAt), {
                    addSuffix: true,
                  })}
                </p>
              </div>
              <CommentActions
                comment={comment}
                user={user}
                onReply={() => setShowReplyForm(true)}
                onDelete={onDelete}
                openDropdownId={openDropdownId}
                setOpenDropdownId={setOpenDropdownId}
              />
            </div>
            <p className="text-[#b0b3b8]">{comment.content}</p>
            <div className="mt-2">
              <CommentReactions commentId={comment.id} />
            </div>
          </div>
          {showReplyForm && (
            <div className="mt-4 ml-4">
              <CommentForm
                feedId={comment.feed_id}
                parentCommentId={comment.id}
                onSubmit={(content) => {
                  onReply(content, comment.id);
                  setShowReplyForm(false);
                }}
                onCancel={() => setShowReplyForm(false)}
              />
            </div>
          )}
        </div>
      </div>

      {hasReplies && (
        <div className="ml-14">
          {showReplies ? (
            <div className="space-y-4">
              {comment.replies.map((reply) => (
                <CommentCard
                  key={reply.id}
                  comment={reply}
                  onReply={onReply}
                  onDelete={onDelete}
                  user={user}
                  openDropdownId={openDropdownId}
                  setOpenDropdownId={setOpenDropdownId}
                />
              ))}
              <button
                onClick={() => setShowReplies(false)}
                className="text-primary hover:text-[#ffd34d] font-medium"
              >
                Hide replies
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowReplies(true)}
              className="text-primary hover:text-[#ffd34d] font-medium"
            >
              Show replies ({comment.replies.length})
            </button>
          )}
        </div>
      )}
    </div>
  );
}
