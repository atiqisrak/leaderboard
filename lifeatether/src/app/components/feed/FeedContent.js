export default function FeedContent({ feed }) {
  return (
    <div>
      <h2 className="text-xl font-bold text-white mb-2">{feed.title}</h2>
      <p className="text-[#b0b3b8] whitespace-pre-wrap">{feed.content}</p>
    </div>
  );
}
