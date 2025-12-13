"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/shadcn/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/shadcn/dialog";
import { Input } from "@/components/shadcn/input";
import { Label } from "@/components/shadcn/label";
import { Textarea } from "@/components/shadcn/textarea";
import { useToast } from "@/components/shadcn/toast";
import { supabase } from "@/lib/supabaseClient";
import { SubmissionTask } from "./submission-card"; // Reuse type
import { AlertCircle } from "lucide-react";

interface SubmissionDialogProps {
    task: SubmissionTask;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
}

export function SubmissionDialog({ task, open, onOpenChange, onSuccess }: SubmissionDialogProps) {
    const t = useTranslations("submissions");
    const { addToast } = useToast();
    const [file, setFile] = useState<File | null>(null);
    const [notes, setNotes] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const isSubmitted = task.status === "submitted";

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file && !task.file_url) { 
             if (!file && !isSubmitted) {
                addToast({ title: "Error", description: "Please select a file.", variant: "destructive" });
                return;
             }
        }

        if (file && file.size > 150 * 1024 * 1024) {
             addToast({ title: "Error", description: "File size exceeds 150MB limit.", variant: "destructive" });
             return;
        }

        setIsSubmitting(true);

        try {
            let publicUrl = task.file_url || "";

            if (file) {
                // 1. Upload File
                const fileExt = file.name.split('.').pop();
                const fileName = `${task.submission_id}_${Date.now()}.${fileExt}`;
                const filePath = `${task.team_id}/${fileName}`; // Organize by team

                const { error: uploadError } = await supabase.storage
                    .from('submissions_bucket')
                    .upload(filePath, file);

                if (uploadError) throw uploadError;

                // 2. Get Public URL
                const { data: urlData } = supabase.storage
                    .from('submissions_bucket')
                    .getPublicUrl(filePath);
                
                publicUrl = urlData.publicUrl;
            }

            // 3. Call Edge Function
            const { error: funcError } = await supabase.functions.invoke('submit-task', {
                body: {
                    submission_id: task.submission_id,
                    file_url: publicUrl,
                    notes: notes
                }
            });

            if (funcError) throw funcError;

            addToast({
                title: t("success"),
                description: t("success"),
                variant: "success",
            });
            
            onSuccess();
            onOpenChange(false);

        } catch (error: any) {
            console.error(error);
            addToast({
                title: "Error",
                description: error.message || "Submission failed",
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>{t("submit")} - {task.title}</DialogTitle>
                    <DialogDescription>
                        {task.description}
                    </DialogDescription>
                </DialogHeader>
                
                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                     {isSubmitted && (
                        <div className="flex items-center gap-2 text-yellow-600 bg-yellow-50 p-3 rounded text-sm mb-4">
                            <AlertCircle className="w-4 h-4" />
                            {t("replaceWarning")}
                        </div>
                    )}

                    <div className="space-y-2">
                        <Label htmlFor="file-upload">
                            {t("fileUrl")} <span className="text-xs text-muted-foreground">{t("maxSizeNote")}</span>
                        </Label>
                        <Input
                            id="file-upload"
                            type="file"
                            onChange={(e) => setFile(e.target.files?.[0] || null)}
                            disabled={isSubmitting}
                        />
                        {task.file_url && !file && (
                             <p className="text-xs text-muted-foreground">Current: <a href={task.file_url} target="_blank" className="underline">View File</a></p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="notes">{t("notes")}</Label>
                        <Textarea
                            id="notes"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder={t("notes")}
                            disabled={isSubmitting}
                        />
                    </div>
                    
                    <DialogFooter>
                         <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? t("submitting") : t("submit")}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
