"use client";

import { useEffect, useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import { format } from "date-fns";
import { supabase } from "@/lib/supabaseClient";
import { SubmissionTask } from "./submission-card"; // Reuse type usually, but defining here for clarity
import { SubmissionDialog } from "./submission-dialog";
import { Button } from "@/components/shadcn/button"; // Adjust if shadcn path is different
import { Badge } from "@/components/shadcn/badge";
import { Loader2, ExternalLink, ClipboardList, AlertCircle } from "lucide-react";

// Re-define if needed or import. Assuming local definition or import is fine.
// The previous file had: import { SubmissionTask } ...
// But I will define it locally to be safe or keep import if it works.
// Let's use the same structure as before but change the JSX.

export function SubmissionsTable() {
    const t = useTranslations("submissions");
    const [tasks, setTasks] = useState<SubmissionTask[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedTask, setSelectedTask] = useState<SubmissionTask | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);

    const fetchSubmissions = useCallback(async () => {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session?.access_token) return;

            const res = await fetch("/api/participant/submissions", {
                 headers: {
                    "Authorization": `Bearer ${session.access_token}`
                }
            });

            if (!res.ok) {
                 const text = await res.text();
                 console.error("API Error Fetching Submissions:", text);
                 return;
            }

            const data = await res.json();
            if (data.submissions) {
                setTasks(data.submissions);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchSubmissions();
    }, [fetchSubmissions]);

    const handleOpenDialog = (task: SubmissionTask) => {
        setSelectedTask(task);
        if (task.status === "passed") return; 
        setDialogOpen(true);
    };

    if (loading) {
        return <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />;
    }

    if (tasks.length === 0) {
        return (
            <div className="text-center p-8 border rounded-lg bg-muted/20">
                <AlertCircle className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-muted-foreground">No tasks found for your team.</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4">
            {tasks.map((task) => (
                <div key={task.submission_id} className="bg-card text-card-foreground p-4 border rounded-lg shadow-sm flex flex-col md:flex-row gap-4 items-start md:items-center justify-between hover:shadow-md transition-shadow">
                    
                    {/* Left: Icon & Info */}
                    <div className="flex items-start gap-4 flex-1">
                        <div className="bg-primary/10 p-3 rounded-full mt-1 shrink-0">
                            <ClipboardList className="w-6 h-6 text-primary" />
                        </div>
                        <div className="space-y-1">
                            <h4 className="font-semibold text-lg">{task.title}</h4>
                            <p className="text-sm text-muted-foreground line-clamp-2 md:line-clamp-1">{task.description}</p>
                            
                            {/* Deadline Display */}
                             <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <span className={new Date() > new Date(task.deadline) ? "text-destructive font-bold" : ""}>
                                    {t("tableHeaders.deadline")}: {format(new Date(task.deadline), "PP p")}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Right: Status & Action */}
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-4 w-full md:w-auto mt-2 md:mt-0 shrink-0">
                         {/* Status Badge */}
                         <div>
                            {task.status === "pending" && <Badge variant="outline" className="bg-yellow-50 text-yellow-700 hover:bg-yellow-50 border-yellow-200">{t("status.pending")}</Badge>}
                            {task.status === "submitted" && <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50 border-green-200">{t("status.submitted")}</Badge>}
                            {task.status === "passed" && <Badge variant="outline" className="bg-red-50 text-red-700 hover:bg-red-50 border-red-200">{t("status.passed")}</Badge>}
                        </div>

                         {/* Submission Link (if exists) */}
                         {task.file_url ? (
                             <a href={task.file_url} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline flex items-center gap-1">
                                <ExternalLink className="w-3 h-3" />
                                {t("viewFile")}
                            </a>
                        ) : (
                            <span className="text-xs text-muted-foreground hidden md:inline">-</span>
                        )}

                        {/* Action Button */}
                         {task.status !== "passed" && new Date(task.deadline) > new Date() ? (
                             <Button 
                                size="sm" 
                                onClick={() => handleOpenDialog(task)}
                                variant={task.status === "submitted" ? "secondary" : "default"}
                            >
                                {task.status === "submitted" ? t("update") : t("tableHeaders.submission")}
                            </Button>
                        ) : (
                            <Button size="sm" disabled variant="ghost">{t("closed")}</Button>
                        )}
                    </div>
                </div>
            ))}

            {selectedTask && (
                <SubmissionDialog 
                    task={selectedTask} 
                    open={dialogOpen} 
                    onOpenChange={setDialogOpen}
                    onSuccess={fetchSubmissions}
                />
            )}
        </div>
    );
}
