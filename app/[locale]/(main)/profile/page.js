"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/shadcn/card";
import { Button } from "@/components/shadcn/button";
import { Loader2, Mail, User } from "lucide-react";

export default function ProfilePage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [member, setMember] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const { data: { user }, error: authError } = await supabase.auth.getUser();

                if (authError || !user) {
                    router.push("/login"); // This goes to (auth)/login due to route structure? No, simply /login route
                    // Wait, moved (auth)/login/page.js means route is still /login
                    return;
                }

                // Check role just in case
                if (user.user_metadata?.role !== 'participant') {
                    // Optionally redirect or show error.
                    // But if they are here, maybe just let them be or redirect.
                }

                // Fetch member details
                let { data: memberData } = await supabase
                    .from("members")
                    .select("*")
                    .eq("auth_id", user.id)
                    .single();

                // Fallback email link if needed (copied from original logic if we want robust linking)
                if (!memberData) {
                    const { data: memberByEmail } = await supabase
                        .from("members")
                        .select("*")
                        .eq("email", user.email)
                        .single();

                    if (memberByEmail) {
                        await supabase.from("members").update({ auth_id: user.id }).eq("id", memberByEmail.id);
                        memberData = memberByEmail;
                    }
                }

                if (!memberData) {
                    setError("Member profile not found.");
                } else {
                    setMember(memberData);
                }

            } catch (err) {
                console.error(err);
                setError("An error occurred loading profile.");
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [router]);

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.push("/login");
    };

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto p-8 text-center">
                <h1 className="text-xl text-red-600 mb-4">{error}</h1>
                <Button onClick={handleSignOut}>Sign Out</Button>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-12 max-w-2xl">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                        <User className="h-6 w-6" />
                        My Profile
                    </CardTitle>
                    <Button variant="outline" onClick={handleSignOut} size="sm">
                        Sign Out
                    </Button>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid gap-4">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Name</p>
                            <p className="text-lg font-semibold">{member.name_en} / {member.name_ar}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Email</p>
                            <div className="flex items-center gap-2">
                                <Mail className="h-4 w-4 text-muted-foreground" />
                                <span>{member.email}</span>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
