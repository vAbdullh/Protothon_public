'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { AdminSidebar } from '@/components/admin/admin-sidebar';
import { SidebarProvider, SidebarTrigger } from "@/components/shadcn/sidebar"

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
      <SidebarProvider>
      <AdminSidebar />
      <main className="flex-1 p-6">
                <SidebarTrigger />
                {children}</main>
      </ SidebarProvider>
    </div>
  );
}
