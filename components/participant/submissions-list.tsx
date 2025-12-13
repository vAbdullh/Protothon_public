"use client";

import { useEffect, useState, useCallback } from "react"; // Added useCallback
import { useTranslations } from "next-intl";
import { SubmissionCard, SubmissionTask } from "./submission-card";
import { Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

export function SubmissionsList() {
    const [tasks, setTasks] = useState<SubmissionTask[]>([]);
    const [loading, setLoading] = useState(true);
    const t = useTranslations("submissions");

    const fetchSubmissions = useCallback(async () => { // Wrapped in useCallback
        try {
            const { data: { session } } = await supabase.auth.getSession();

            const res = await fetch("/api/participant/submissions", {
                 headers: {
                    "Authorization": `Bearer ${session?.access_token}`
                }
            });
            const data = await res.json();
            
            if (res.ok && data.submissions) {
                setTasks(data.submissions);
            }
        } catch (error) {
            console.error("Failed to fetch submissions", error);
        } finally {
            setLoading(false);
        }
    }, []); // Empty dependency array

    useEffect(() => {
        fetchSubmissions();
    }, [fetchSubmissions]); // Added fetchSubmissions to dependency array

    if (loading) {
        return (
            <div className="flex justify-center py-8">
                <Loader2 className="animate-spin h-8 w-8 text-primary" />
            </div>
        );
    }

    if (tasks.length === 0) {
        return (
            <div className="text-center py-8 text-muted-foreground">
                No active tasks found.
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold">{t("title")}</h2>
            <div className="grid gap-6">
                {tasks.map((task) => (
                    <SubmissionCard 
                        key={task.submission_id} 
                        task={task} 
                        onSuccess={fetchSubmissions} 
                    />
                ))}
            </div>
        </div>
    );
}
