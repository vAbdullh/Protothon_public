"use client";

import { LogOut } from "lucide-react";
import { Button } from "@/components/shadcn/button";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type UserData = {
  email?: string;
  user_metadata?: {
    display_name?: string;
    avatar_url?: string;
  };
};

export function UserBox() {
  const [user, setUser] = useState<UserData | null>(null);

  useEffect(() => {
    const getSession = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setUser({
          email: user.email,
          user_metadata: user.user_metadata,
        });
      }
    };

    getSession();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  const getInitials = () => {
    const name = user?.user_metadata?.display_name;
    if (name) {
      const names = name.split(" ");
      return names.length >= 2
        ? `${names[0][0]}${names[1][0]}`.toUpperCase()
        : name.substring(0, 2).toUpperCase();
    }
    return user?.email?.substring(0, 2).toUpperCase() || "US";
  };

  return (
    <div className="flex items-center gap-4 p-4 border-t border-border max-w-3xs  ">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
        <span className="text-sm font-medium">{getInitials()}</span>
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">
          {user?.user_metadata?.display_name || "Unknown Admin"}
        </p>
        <p className="text-xs text-muted-foreground truncate whitespace-break-spaces">
          {user?.email
            ? `${user.email.slice(0, 3)}${"*".repeat(5)}${user.email.slice(-2)}`
            : "No email provided  "}
        </p>
      </div>

      <Button
        variant="ghost"
        size="icon"
        onClick={handleLogout}
        title="Logout"
        color="#ff0000"
      >
        <LogOut className="h-4 w-4 text-red-500" />
      </Button>
    </div>
  );
}
