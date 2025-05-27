"use client";

import Image from "next/image";
import Link from "next/link";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();
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
        <div className="flex items-center gap-8">
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
            <Link
              href="/auth/login"
              className="bg-[#FCB813] text-[#181b20] px-4 py-2 rounded-lg font-semibold hover:bg-[#ffd34d] transition-colors"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
