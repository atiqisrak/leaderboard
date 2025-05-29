"use client";

import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import CreatePostModal from "./CreatePostModal";

export default function Hero({ onPostCreated }) {
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

  const handleCreatePost = (postData) => {
    setShowModal(false);
    if (onPostCreated) {
      onPostCreated(postData);
    }
  };

  return (
    <>
      <section className="pt-32 pb-12 text-center bg-secondary">
        <div className="max-w-3xl mx-auto px-6">
          <h1 className="text-5xl font-bold mb-4 text-primary">
            Life @ EtherTech
          </h1>
          <p className="text-xl text-[#b0b3b8] mb-8">
            A place for EtherTechers to share, connect, and celebrate daily life
          </p>
          <button
            onClick={handleSharePost}
            className="inline-flex items-center px-7 py-3 bg-primary text-secondary rounded-full font-semibold text-base transition-all hover:bg-[#ffd34d] hover:-translate-y-0.5 shadow-lg"
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
