import { formatDistanceToNow } from "date-fns";
import Image from "next/image";

export default function FeedHeader({ feed }) {
  return (
    <div className="flex items-center gap-4 mb-4">
      <div className="relative w-12 h-12 rounded-full overflow-hidden">
        {feed?.author?.avatar ? (
          <Image
            src={feed.author.avatar || "/default-avatar.png"}
            alt={feed.author.name}
            width={48}
            height={48}
            className="object-cover"
          />
        ) : (
          <Image
            src="/default-avatar.png"
            alt={feed?.author?.name}
            width={48}
            height={48}
            className="object-cover"
          />
        )}
      </div>
      <div>
        <h3 className="text-white font-semibold">{feed?.author?.name}</h3>
        <p className="text-[#b0b3b8] text-sm">
          {formatDistanceToNow(new Date(feed?.createdAt), {
            addSuffix: true,
          })}
        </p>
      </div>
    </div>
  );
}
