"use client";

import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

const ALLOWED_DOMAINS = ["ethertech.ltd", "webable.digital"];

export default function Signup({ isModal = true }) {
  const [name, setName] = useState("");
  const [emailPrefix, setEmailPrefix] = useState("");
  const [selectedDomain, setSelectedDomain] = useState(ALLOWED_DOMAINS[0]);
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

    const fullEmail = `${emailPrefix}@${selectedDomain}`;

    try {
      const response = await fetch("/api/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email: fullEmail,
          password,
          role: "user",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      if (data.success && data.user && data.user.access_token) {
        const loginSuccess = await login(fullEmail, password);
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
    : "min-h-screen bg-secondary flex items-center justify-center p-4";

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
              className="w-full px-4 py-2 bg-secondary border border-primary/20 rounded-lg text-white focus:outline-none focus:border-primary"
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
            <div className="flex gap-2">
              <input
                type="text"
                id="email"
                value={emailPrefix}
                onChange={(e) => setEmailPrefix(e.target.value)}
                className="flex-1 px-4 py-2 bg-secondary border border-primary/20 rounded-lg text-white focus:outline-none focus:border-primary"
                required
                disabled={isLoading}
                placeholder="username"
              />
              <span className="flex items-center text-white">@</span>
              <select
                value={selectedDomain}
                onChange={(e) => setSelectedDomain(e.target.value)}
                className="px-4 py-2 bg-secondary border border-primary/20 rounded-lg text-white focus:outline-none focus:border-primary"
                disabled={isLoading}
              >
                {ALLOWED_DOMAINS.map((domain) => (
                  <option key={domain} value={domain}>
                    {domain}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-[#b0b3b8] mb-1"
            >
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 bg-secondary border border-primary/20 rounded-lg text-white focus:outline-none focus:border-primary"
                required
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#b0b3b8] hover:text-white transition-colors"
              >
                {showPassword ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            className="w-full bg-primary text-secondary py-2 rounded-lg font-semibold hover:bg-[#ffd34d] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? "Signing up..." : "Sign Up"}
          </button>
        </form>
        <div className="flex justify-center mt-4">
          <p className="text-sm text-[#b0b3b8]">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-primary">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
