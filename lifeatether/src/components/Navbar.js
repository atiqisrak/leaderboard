"use client";

import Link from "next/link";
import { useAuth } from "../app/context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-[#23262b] border-b border-[#FCB813]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-[#FCB813] font-bold text-xl">
              EtherTech
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <span className="text-[#b0b3b8]">Welcome, {user.name}</span>
                <button
                  onClick={logout}
                  className="bg-[#FCB813] text-[#181b20] px-4 py-2 rounded-lg font-semibold hover:bg-[#ffd34d] transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                href="/auth/login"
                className="bg-[#FCB813] text-[#181b20] px-4 py-2 rounded-lg font-semibold hover:bg-[#ffd34d] transition-colors"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
