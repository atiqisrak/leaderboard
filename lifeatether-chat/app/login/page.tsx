"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const ENGINE_URL = process.env.NEXT_PUBLIC_ENGINE_URL || 'http://localhost:3098';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      const res = await fetch(`${ENGINE_URL}/api/v1/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      });

      const data = await res.json();

      if (res.ok) {
        // Store token and user info
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        router.push('/');
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Failed to connect to server');
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
      <div className="w-80 bg-[var(--card-bg)] p-6 rounded-2xl shadow-lg">
        <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>
        {error && (
          <div className="mb-4 p-2 bg-red-100 text-red-700 rounded text-sm">
            {error}
          </div>
        )}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 rounded bg-[var(--section-bg)] text-[var(--text-color)]"
              required
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 rounded bg-[var(--section-bg)] text-[var(--text-color)]"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-[var(--primary-color)] text-[var(--background)] rounded px-4 py-2 font-bold hover:opacity-90 transition-opacity"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
} 