"use client";

export default function DeleteFeedModal({
  isOpen,
  onClose,
  onConfirm,
  feedTitle,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[#23262b] p-8 rounded-2xl w-full max-w-md">
        <h2 className="text-2xl font-bold text-white mb-4">Delete Post</h2>
        <p className="text-[#b0b3b8] mb-6">
          Are you sure you want to delete this post? This action cannot be
          undone.
        </p>
        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-[#b0b3b8] hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
