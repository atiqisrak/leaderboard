import { formatDistanceToNow } from "date-fns";
import Image from "next/image";
import FeedHeader from "./FeedHeader";
import FeedContent from "./FeedContent";
import FeedActions from "./FeedActions";

export default function FeedItem({ feed, user, onDelete, onEdit, onShare }) {
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
    </div>
  );
}
