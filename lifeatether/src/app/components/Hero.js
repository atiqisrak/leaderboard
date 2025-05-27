"use client";

import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import CreatePostModal from "./CreatePostModal";

export default function Hero() {
  const [showModal, setShowModal] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  const handleSharePost = () => {
    if (!user) {
      router.push("/login");
      return;
    }
    setShowModal(true);
  };

  const handleCreatePost = async (postData) => {
    try {
      const response = await fetch("/api/feed", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...postData,
          authorId: user.id,
        }),
      });

      if (response.ok) {
        setShowModal(false);
        router.refresh(); // Refresh the page to show the new post
      }
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  return (
    <>
      <section className="pt-32 pb-12 text-center bg-[#181b20]">
        <div className="max-w-3xl mx-auto px-6">
          <h1 className="text-5xl font-bold mb-4 text-[#FCB813]">
            Life @ EtherTech
          </h1>
          <p className="text-xl text-[#b0b3b8] mb-8">
            A place for EtherTechers to share, connect, and celebrate daily life
          </p>
          <button
            onClick={handleSharePost}
            className="inline-flex items-center px-7 py-3 bg-[#FCB813] text-[#181b20] rounded-full font-semibold text-base transition-all hover:bg-[#ffd34d] hover:-translate-y-0.5 shadow-lg"
          >
            <i className="fas fa-plus mr-2"></i>
            Share a Post
          </button>
        </div>
      </section>

      <CreatePostModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleCreatePost}
      />
    </>
  );
}
