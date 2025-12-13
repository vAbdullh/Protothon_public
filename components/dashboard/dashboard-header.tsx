"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/shadcn/button";
import { LogOut, User, Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/shadcn/sheet";
import LanguageSwitcher from "@/components/language-switcher";
import { useTranslations } from "next-intl"; 

export function DashboardHeader() {
    const t = useTranslations("header");
    const [memberName, setMemberName] = useState("");
    const router = useRouter();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const { data: { session }, error: sessionError } = await supabase.auth.getSession();
                if (sessionError || !session?.user) return; // Handle no session

                const user = session.user;
                
                 const { data: member, error: memberError } = await supabase
                    .from("members")
                    .select("name_en, name_ar")
                    .eq("auth_id", user.id)
                    .single();
                 
                 if (member) {
                     setMemberName(member.name_en); 
                 }
            } catch (error) {
                console.error("Error fetching user:", error);
            }
        };
        fetchUser();
    }, []);

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.push("/login");
    };

    return (
        <header className="border-b bg-white">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <div className="flex items-center gap-2">
                     <Image
                        src="/protothon-logo-purple.png"
                        alt="Protothon Logo"
                        width={120}
                        height={40}
                        className="object-contain"
                        priority
                    />
                </div>
                
                {/* Desktop View */}
                <div className="hidden md:flex items-center gap-4">
                    <LanguageSwitcher />
                    {memberName && (
                        <div className="flex items-center gap-2 text-sm font-medium">
                            <User className="w-4 h-4 text-muted-foreground" />
                            <span>{t("welcome", { name: memberName })}</span>
                        </div>
                    )}
                    <Button variant="ghost" size="sm" onClick={handleSignOut} className="text-red-500 hover:text-red-600 hover:bg-red-50">
                        <LogOut className="w-4 h-4 mr-2" />
                        {t("signOut")}
                    </Button>
                </div>

                {/* Mobile View with Sidebar */}
                <div className="md:hidden">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <Menu className="w-6 h-6" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent>
                            <div className="flex flex-col gap-2 mt-6 py-10 px-2">
                                {/* Mobile User Info */}
                                {memberName && (
                                    <div className="flex items-center gap-2 text-sm font-medium mb-4">
                                        <User className="w-4 h-4 text-muted-foreground" />
                                        <span>{t("welcome", { name: memberName })}</span>
                                    </div>
                                )}
                                
                                <div className="flex flex-col gap-4">
                                    <LanguageSwitcher />
                                </div>

                                <div>
                                    <Button variant="destructive" size="lg" onClick={handleSignOut} className="w-full">
                                        <LogOut className="w-4 h-4 mr-2" />
                                        {t("signOut")}
                                    </Button>
                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </header>
    );
}
