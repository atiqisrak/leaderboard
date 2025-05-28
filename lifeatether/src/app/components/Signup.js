"use client";

import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Signup({ isModal = true }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      console.log("Submitting registration form");
      const response = await fetch("/api/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
          role: "user",
        }),
      });

      const data = await response.json();
      console.log("Registration response:", {
        ...data,
        user: data.user ? { ...data.user, password: "[REDACTED]" } : null,
      });

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      if (data.success && data.user && data.user.access_token) {
        console.log("Registration successful, logging in user");
        const loginSuccess = await login(email, password);
        if (!loginSuccess) {
          throw new Error("Registration successful but login failed");
        }
      } else {
        console.error("Invalid response format:", data);
        throw new Error("Invalid response from server");
      }
    } catch (error) {
      console.error("Registration error:", error);
      setError(
        error.message ||
          "An error occurred during registration. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const containerClasses = isModal
    ? "fixed inset-0 bg-black/50 flex items-center justify-center z-50"
    : "min-h-screen bg-[#181b20] flex items-center justify-center p-4";

  return (
    <div className={containerClasses}>
      <div className="bg-[#23262b] p-8 rounded-2xl w-full max-w-md">
        <div className="flex justify-center mb-6 items-center gap-2">
          <h1 className="text-2xl font-bold text-white">Life at</h1>
          <Image
            src="/logo.svg"
            alt="EtherTech Logo"
            width={120}
            height={40}
            className="object-contain"
            priority
          />
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-[#b0b3b8] mb-1"
            >
              Full Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 bg-[#181b20] border border-[#FCB813]/20 rounded-lg text-white focus:outline-none focus:border-[#FCB813]"
              required
              disabled={isLoading}
            />
          </div>
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
              disabled={isLoading}
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
              type={showPassword ? "text" : "password"}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 bg-[#181b20] border border-[#FCB813]/20 rounded-lg text-white focus:outline-none focus:border-[#FCB813]"
              required
              disabled={isLoading}
            />
            <button
              type="button"
              className="text-sm text-[#b0b3b8] mt-1"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "Hide Password" : "Show Password"}
            </button>
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            className="w-full bg-[#FCB813] text-[#181b20] py-2 rounded-lg font-semibold hover:bg-[#ffd34d] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? "Signing up..." : "Sign Up"}
          </button>
        </form>
        <div className="flex justify-center mt-4">
          <p className="text-sm text-[#b0b3b8]">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-[#FCB813]">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
