"use client"
import Image from 'next/image';
import React from 'react'
import { useRouter } from 'next/navigation';

const Header = () => {
  const router = useRouter();
  return (
    <div className="bg-black p-4 flex items-center justify-between">
        <Image src="/logo.svg" alt="Logo" width={140} height={140} />
        {/* <button
          onClick={() => {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            router.push('/login');
          }}
          className="text-[var(--text-color)] hover:opacity-80"
        >
          Logout
        </button> */}
        <div className="flex gap-4">
            <Image src="/icons/write.svg" alt="Write Message" width={30} height={30} />
            <Image src="/icons/apple-icon-180x180.png" alt="Life at Ether" width={30} height={30} />
        </div>
      </div>
  )
}

export default Header