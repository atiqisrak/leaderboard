"use client";

import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import Image from "next/image";

export default function Login({ isModal = true }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const success = await login(email, password);
    if (!success) {
      setError("Invalid email or password");
    }
  };

  const containerClasses = isModal
    ? "fixed inset-0 bg-black/50 flex items-center justify-center z-50"
    : "min-h-screen bg-[#181b20] flex items-center justify-center p-4";

  return (
    <div className={containerClasses}>
      <div className="bg-[#23262b] p-8 rounded-2xl w-full max-w-md">
        <Image
          src="/logo.svg"
          alt="EtherTech Logo"
          width={120}
          height={40}
          className="object-contain"
          priority
        />
        <h2 className="text-2xl font-bold mb-6 text-[#FCB813]">
          Login to EtherTech
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-[#b0b3b8] mb-1"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 bg-[#181b20] border border-[#FCB813]/20 rounded-lg text-white focus:outline-none focus:border-[#FCB813]"
              required
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-[#b0b3b8] mb-1"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 bg-[#181b20] border border-[#FCB813]/20 rounded-lg text-white focus:outline-none focus:border-[#FCB813]"
              required
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            className="w-full bg-[#FCB813] text-[#181b20] py-2 rounded-lg font-semibold hover:bg-[#ffd34d] transition-colors"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
