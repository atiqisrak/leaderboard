"use client";

import Image from "next/image";
import Link from "next/link";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogin = () => {
    router.push("/auth/login");
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-[#23262b] z-50 py-4 shadow-lg">
      <div className="max-w-3xl mx-auto px-6 flex justify-between items-center">
        <div className="logo cursor-pointer" onClick={() => router.push("/")}>
          <Image
            src="/logo.svg"
            alt="EtherTech Logo"
            width={150}
            height={100}
            priority
          />
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMenu}
          className="lg:hidden text-white p-2"
          aria-label="Toggle menu"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {isMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center gap-8">
          <ul className="flex gap-8">
            <li>
              <Link
                href="#feed"
                className="text-white hover:bg-[#FCB813] hover:text-[#181b20] px-3 py-1 rounded-full transition-colors"
              >
                Feed
              </Link>
            </li>
            <li>
              <Link
                href="#community"
                className="text-white hover:bg-[#FCB813] hover:text-[#181b20] px-3 py-1 rounded-full transition-colors"
              >
                Community
              </Link>
            </li>
            <li>
              <Link
                href="#about"
                className="text-white hover:bg-[#FCB813] hover:text-[#181b20] px-3 py-1 rounded-full transition-colors"
              >
                About
              </Link>
            </li>
          </ul>
          {user ? (
            <button
              onClick={logout}
              className="bg-[#FCB813] text-[#181b20] px-4 py-2 rounded-lg font-semibold hover:bg-[#ffd34d] transition-colors"
            >
              Logout
            </button>
          ) : (
            <button
              onClick={handleLogin}
              className="bg-[#FCB813] text-[#181b20] px-4 py-2 rounded-lg font-semibold hover:bg-[#ffd34d] transition-colors"
            >
              Login
            </button>
          )}
        </div>
      </div>

      {/* Mobile Menu - Moved outside the container div */}
      <div
        className={`lg:hidden absolute left-0 right-0 bg-[#23262b] shadow-lg transition-all duration-300 ease-in-out ${
          isMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        style={{ top: "100%" }}
      >
        <div className="px-6 py-4 space-y-4">
          <ul className="space-y-4">
            <li>
              <Link
                href="#feed"
                className="block text-white hover:bg-[#FCB813] hover:text-[#181b20] px-3 py-2 rounded-lg transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Feed
              </Link>
            </li>
            <li>
              <Link
                href="#community"
                className="block text-white hover:bg-[#FCB813] hover:text-[#181b20] px-3 py-2 rounded-lg transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Community
              </Link>
            </li>
            <li>
              <Link
                href="#about"
                className="block text-white hover:bg-[#FCB813] hover:text-[#181b20] px-3 py-2 rounded-lg transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
            </li>
          </ul>
          <div className="pt-4 border-t border-gray-700">
            {user ? (
              <button
                onClick={() => {
                  logout();
                  setIsMenuOpen(false);
                }}
                className="w-full bg-[#FCB813] text-[#181b20] px-4 py-2 rounded-lg font-semibold hover:bg-[#ffd34d] transition-colors"
              >
                Logout
              </button>
            ) : (
              <button
                onClick={() => {
                  handleLogin();
                  setIsMenuOpen(false);
                }}
                className="w-full bg-[#FCB813] text-[#181b20] px-4 py-2 rounded-lg font-semibold hover:bg-[#ffd34d] transition-colors"
              >
                Login
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
