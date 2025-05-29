"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";

export default function EditFeedModal({ isOpen, onClose, onSave, feed }) {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();

    // Update form when feed data changes
    useEffect(() => {
        if (feed) {
            setTitle(feed.title || "");
            setContent(feed.content || "");
        }
    }, [feed]);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const response = await fetch(`/api/feeds/${feed.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user?.access_token}`,
                },
                body: JSON.stringify({ title, content }),
            });

            const data = await response.json();

            if (data.success) {
                onSave(data.feed);
                onClose();
            } else {
                setError(data.message || "Failed to update feed");
            }
        } catch (error) {
            console.error("Error updating feed:", error);
            setError("Failed to update feed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-[#23262b] rounded-lg p-6 w-full max-w-2xl mx-4">
                <h2 className="text-2xl font-semibold text-white mb-4">Edit Feed</h2>

                {error && (
                    <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-2 rounded mb-4">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="title" className="block text-white mb-2">
                            Title
                        </label>
                        <input
                            type="text"
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full px-4 py-2 bg-[#1a1c20] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                            required
                            maxLength={255}
                        />
                    </div>

                    <div className="mb-6">
                        <label htmlFor="content" className="block text-white mb-2">
                            Content
                        </label>
                        <textarea
                            id="content"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className="w-full px-4 py-2 bg-[#1a1c20] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary min-h-[200px]"
                            required
                        />
                    </div>

                    <div className="flex justify-end space-x-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2 text-white hover:bg-[#1a1c20] rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-2 bg-primary text-secondary rounded-lg font-semibold hover:bg-[#ffd34d] transition-colors disabled:opacity-50"
                        >
                            {loading ? "Saving..." : "Save Changes"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
} 