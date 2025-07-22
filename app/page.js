'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Image from 'next/image';

export default function Home() {
  const [status, setStatus] = useState('');
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const getHealth = async () => {
      try {
        const res = await fetch('/api/health');
        const data = await res.json();
        setStatus(data.status);
      } catch (error) {
        setStatus('Failed to fetch health');
      }
    };

    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data?.user || null);
    };

    getHealth();
    getUser();
  }, []);

  const handleLogin = async () => {
    if (!email) return;

    const { error } = await supabase.auth.signInWithOtp({ email });
    if (error) {
      setMessage('Login failed. Please try again.');
    } else {
      setMessage('Check your email for the magic link!');
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const getRandomColor = () => {
    const colors = ['bg-red-500', 'bg-green-500', 'bg-blue-500', 'bg-yellow-500', 'bg-purple-500'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  return (
    <div className="font-sans grid place-items-center h-screen px-4 text-center">
      <main className="flex flex-col gap-8 items-center">
        <Image
          src="/next.svg"
          alt="Protothon Logo"
          width={150}
          height={150}
          className="mb-4 dark:invert"
        />
        <h1 className="text-4xl font-bold">Welcome to Protothon Website!</h1>
        <p className="text-lg text-gray-500">Under development... 🛠️</p>
        <p className="text-lg">
          API Health:&nbsp;
          {status && status !== 'Failed to fetch health' ? (
            <span className="text-green-600">{status}</span>
          ) : (
            <span className="text-red-600">Error</span>
          )}
        </p>

        {user ? (
          <div className="flex flex-col items-center gap-4 border p-4 rounded-xl bg-gray-100 dark:bg-gray-800">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 flex items-center justify-center text-white text-xl rounded-full ${getRandomColor()}`}>
                {user.email.charAt(0).toUpperCase()}
              </div>
              <div className="text-left">
                <p className="font-bold">{user.user_metadata?.full_name || 'User'}</p>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
            <button
              onClick={handleLogout}
              className="mt-2 px-4 py-2 bg-red-500 text-white rounded-md hover:opacity-90"
              >
              Logout
            </button>
              </div>  
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="px-4 py-2 border rounded-md"
            />
            <button
              onClick={handleLogin}
              className="px-6 py-2 bg-black text-white rounded-md hover:opacity-90"
            >
              Send Magic Link
            </button>
            {message && <p className="text-sm text-gray-500 mt-2">{message}</p>}
          </div>
        )}
      </main>
    </div>
  );
}
