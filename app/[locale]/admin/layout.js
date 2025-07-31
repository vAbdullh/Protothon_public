'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export default function DashboardLayout({ children }) {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data?.user) {
        router.push('/auth');
      }
      setUser(data?.user || null);
    };

    checkAuth();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  const getRandomColor = () => {
    const colors = ['bg-red-500', 'bg-green-500', 'bg-blue-500', 'bg-yellow-500', 'bg-purple-500'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  if (!user) return null;

  return (
    <div className="flex">
      <nav className="w-64 text-white h-screen p-4 border-r border-gray-900 bg-black/90">
        <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
        
        {user && (
          <div className="mt-8 p-4 bg-gray-700 rounded-lg">
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-10 h-10 flex items-center justify-center text-white text-lg rounded-full ${getRandomColor()}`}>
                {user.email.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-medium">{user.user_metadata?.full_name || 'User'}</p>
                <p className="text-xs text-gray-300">{user.email}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full py-1 text-sm bg-red-600 hover:bg-red-700 rounded-md transition-colors"
            >
              Logout
            </button>
          </div>
        )}
      </nav>
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
