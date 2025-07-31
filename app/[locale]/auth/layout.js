'use client';

import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { useEffect } from 'react';

export default function AuthLayout({ children }) {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        router.push('/dashboard');
      }
    };
    checkAuth();
  }, [router]);

  return (
    <div className="font-sans grid place-items-center h-screen px-4 text-center">
      <main className="w-full max-w-md">
        {children}
      </main>
    </div>
  );
}
