"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { format } from "date-fns";
import { Badge } from "@/components/shadcn/badge";
import { Button } from "@/components/shadcn/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/shadcn/card";
import { Input } from "@/components/shadcn/input";
import { Label } from "@/components/shadcn/label";
import { Textarea } from "@/components/shadcn/textarea";
import { ExternalLink, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { useToast } from "@/components/shadcn/toast";
import { supabase } from "@/lib/supabaseClient";

export type SubmissionStatus = "pending" | "submitted" | "passed";

export interface SubmissionTask {
  submission_id: string;
  title: string;
  description: string;
  deadline: string;
  team_id: string;
  file_url: string | null;
  submitted_at: string | null;
  status: SubmissionStatus;
}

interface SubmissionCardProps {
  task: SubmissionTask;
  onSuccess: () => void;
}

export function SubmissionCard({ task, onSuccess }: SubmissionCardProps) {
  const t = useTranslations("submissions");
  const { addToast } = useToast();
  
  const [fileUrl, setFileUrl] = useState(task.file_url || "");
  const [notes, setNotes] = useState(""); // We might want to prefill notes if available, but view doesn't return notes by default in plan. Let's assume blank for now or update API/View later if needed.
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isPassed = task.status === "passed";
  const isSubmitted = task.status === "submitted";

  const getStatusBadge = () => {
    switch (task.status) {
      case "submitted":
        return <Badge className="bg-green-600 hover:bg-green-700">{t("status.submitted")}</Badge>;
      case "passed":
        return <Badge variant="destructive">{t("status.passed")}</Badge>;
      default:
        return <Badge variant="secondary" className="bg-yellow-500 hover:bg-yellow-600 text-white">{t("status.pending")}</Badge>;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isPassed) return;

    setIsSubmitting(true);

    try {
        const { data: { session } } = await supabase.auth.getSession();
        
        const res = await fetch("/api/participant/submissions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${session?.access_token}`
            },
            body: JSON.stringify({
                submission_id: task.submission_id,
                file_url: fileUrl,
                notes: notes
            })
        });

        const data = await res.json();

        if (!res.ok) throw new Error(data.error || "Submission failed");

        addToast({
            title: t("success"),
            description: t("success"),
            variant: "success",
        });
        
        onSuccess(); // Refresh list

    } catch (error: any) {
        addToast({
            title: "Error",
            description: error.message,
            variant: "destructive",
        });
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-start">
            <div>
                <CardTitle className="text-xl">{task.title}</CardTitle>
                <div className="text-sm text-muted-foreground mt-1 flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{format(new Date(task.deadline), "PPP p")}</span> 
                    {/* Locale formatting could be improved with date-fns locale but standard is ok */}
                </div>
            </div>
            {getStatusBadge()}
        </div>
        <CardDescription className="pt-2">{task.description}</CardDescription>
      </CardHeader>
      
      <CardContent>
        {isSubmitted && (
             <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
                <CheckCircle className="text-green-600 w-5 h-5 flex-shrink-0" />
                <div className="flex-1 overflow-hidden">
                    <p className="text-sm font-medium text-green-800">{t("status.submitted")}</p>
                    <a href={task.file_url!} target="_blank" rel="noopener noreferrer" className="text-sm text-green-700 underline truncate block">
                        {task.file_url}
                    </a>
                </div>
                <Button variant="ghost" size="sm" asChild>
                    <a href={task.file_url!} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-4 h-4" />
                    </a>
                </Button>
             </div>
        )}

        {!isPassed && (
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor={`file-${task.submission_id}`}>{t("fileUrl")}</Label>
                    <Input 
                        id={`file-${task.submission_id}`}
                        placeholder="https://..."
                        value={fileUrl}
                        onChange={(e) => setFileUrl(e.target.value)}
                        required
                        disabled={isSubmitting}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor={`notes-${task.submission_id}`}>{t("notes")}</Label>
                    <Textarea 
                        id={`notes-${task.submission_id}`}
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        disabled={isSubmitting}
                    />
                </div>

                {isSubmitted && (
                    <div className="flex items-center gap-2 text-yellow-600 bg-yellow-50 p-3 rounded text-sm">
                        <AlertCircle className="w-4 h-4" />
                        {t("replaceWarning")}
                    </div>
                )}
                
                <Button type="submit" disabled={isSubmitting} className="w-full">
                    {isSubmitting ? t("submitting") : t("submit")}
                </Button>
            </form>
        )}

        {isPassed && !isSubmitted && (
            <div className="p-4 bg-red-50 text-red-600 rounded text-center font-medium">
                {t("passedMessage")}
            </div>
        )}
      </CardContent>
    </Card>
  );
}
