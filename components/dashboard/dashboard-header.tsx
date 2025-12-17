"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/shadcn/button";
import { LogOut, User, Menu, LayoutDashboard, FileText } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/shadcn/sheet";
import LanguageSwitcher from "@/components/language-switcher";
import { useTranslations, useLocale } from "next-intl"; 

export function DashboardHeader() {
    const t = useTranslations("header");
    const tApp = useTranslations("myApplication");
    const tSub = useTranslations("submissions");
    const [memberName, setMemberName] = useState("");
    const router = useRouter();
    const pathname = usePathname();
    const locale = useLocale();

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

    const isActive = (path: string) => pathname?.includes(path);

    return (
        <header className="border-b bg-white sticky top-0 z-30">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <div className="flex items-center gap-6">
                     <Image
                        src="/protothon-logo-purple.png"
                        alt="Protothon Logo"
                        width={120}
                        height={40}
                        className="object-contain"
                        priority
                    />

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-6">
                        <Link 
                            href={`/${locale}/submissions`} 
                            className={`text-sm transition-colors hover:text-primary ${isActive('/submissions') ? 'text-primary' : 'text-gray-600'}`}
                        >
                            {tSub("title")}
                        </Link>
                        <Link 
                            href={`/${locale}/my-application`} 
                            className={`text-sm transition-colors hover:text-primary ${isActive('/my-application') ? 'text-primary' : 'text-gray-600'}`}
                        >
                            {tApp("title")}
                        </Link>
                    </nav>
                </div>
                
                {/* Desktop User Actions */}
                <div className="hidden md:flex items-center gap-4">
                    <LanguageSwitcher />
                    {memberName && (
                        <div className="flex items-center gap-2 text-sm font-medium bg-gray-50 px-3 py-1.5 rounded-full border">
                            <User className="w-4 h-4 text-muted-foreground" />
                            <span className="truncate max-w-[150px]">{t("welcome", { name: memberName })}</span>
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
                            <div className="flex flex-col gap-6 mt-6 py-4">
                                {/* Mobile User Info */}
                                {memberName && (
                                    <div className="flex items-center gap-2 text-sm font-medium p-4 bg-gray-50 rounded-lg">
                                        <User className="w-4 h-4 text-muted-foreground" />
                                        <span>{t("welcome", { name: memberName })}</span>
                                    </div>
                                )}

                                {/* Mobile Navigation */}
                                <nav className="flex flex-col gap-2">
                                     <Link 
                                        href={`/${locale}/submissions`}
                                        className={`flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${isActive('/submissions') ? 'bg-primary/10 text-primary' : 'hover:bg-gray-100 text-gray-700'}`}
                                    >
                                        <LayoutDashboard className="w-5 h-5" />
                                        <span className="font-medium">{tSub("title")}</span>
                                    </Link>
                                    <Link 
                                        href={`/${locale}/my-application`}
                                        className={`flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${isActive('/my-application') ? 'bg-primary/10 text-primary' : 'hover:bg-gray-100 text-gray-700'}`}
                                    >
                                        <FileText className="w-5 h-5" />
                                        <span className="font-medium">{tApp("title")}</span>
                                    </Link>
                                </nav>
                                
                                <div className="border-t pt-4 flex flex-col gap-4">
                                    <LanguageSwitcher />
                                    <Button variant="destructive" size="lg" onClick={handleSignOut} className="w-full justify-start">
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
