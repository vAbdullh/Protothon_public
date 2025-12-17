"use client";

import React, { useState, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useForm, useFieldArray } from "react-hook-form";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/shadcn/button";
import { Input } from "@/components/shadcn/input";
import { Label } from "@/components/shadcn/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/shadcn/select";
import { useToast } from "@/components/shadcn/toast";
import { Loader2, Edit2, Save, X, Trash2, Plus, User } from "lucide-react";

// Types
type Member = {
  id?: string;
  nameAr: string;
  nameEn: string;
  phone: string;
  email: string;
  university: string;
  uniId: string;
  major: string;
  otherUniversity?: string;
  isLeader: boolean;
  gender?: string;
};

type ApplicationData = {
  team_name: string;
  track: string;
  idea_title: string;
  idea_description: string;
  members: Member[];
};

const UNIVERSITY_OPTIONS = [
  { value: "kau", label: "King Abdulaziz University" },
  { value: "other", label: "Other" },
];

export default function MyApplicationClient() {
  const t = useTranslations("myApplication");
  const tForm = useTranslations("form");
  const tTracks = useTranslations("header.tracksList");
  const locale = useLocale();
  const isRTL = locale === "ar";
  const { addToast } = useToast();
  
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [appData, setAppData] = useState<ApplicationData | null>(null);

  const { register, control, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm({
    defaultValues: {
      members: [] as Member[]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "members"
  });

  const fetchApplication = async () => {
    try {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
          return;
      }

      const res = await fetch("/api/participant/application", {
        headers: {
          Authorization: `Bearer ${session.access_token}`
        }
      });
      
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || t("errors.fetchFailed"));

      setAppData(data.application);
      
      // Map members to form structure
      const formattedMembers = data.application.members.map((m: any) => ({
        id: m.id,
        nameAr: m.name_ar,
        nameEn: m.name_en,
        phone: m.phone,
        email: m.email,
        university: m.university === 'King Abdulaziz University' ? 'kau' : 'other',
        otherUniversity: m.university !== 'King Abdulaziz University' ? m.university : '',
        uniId: m.university_id || '',
        major: m.major,
        isLeader: m.is_leader,
        gender: m.gender
      }));

      reset({ members: formattedMembers });

    } catch (error: any) {
      console.error(error);
      addToast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplication();
  }, []);

  const handleSave = async (data: { members: Member[] }) => {
    try {
        // Validation: Min 3, Max 5
        if (data.members.length < 3) {
            addToast({
                title: t("errors.teamSize"),
                description: t("errors.teamSize"),
                variant: "warning"
            });
            return;
        }

        // Leader check
        const leaders = data.members.filter(m => m.isLeader);
        if (leaders.length !== 1) {
             addToast({
                title: t("errors.leaderRequired"),
                description: t("errors.leaderRequired"),
                variant: "warning"
            });
            return;
        }

        setLoading(true);
        const { data: { session } } = await supabase.auth.getSession();
        
        const res = await fetch("/api/participant/application", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${session?.access_token}`
            },
            body: JSON.stringify({ members: data.members })
        });

        if (!res.ok) {
            const err = await res.json();
             throw new Error(err.error || t("errors.updateFailed"));
        }

        addToast({
            title: t("errors.updateSuccess"),
            description: t("errors.updateSuccess"),
            variant: "success"
        });
        
        setIsEditing(false);
        fetchApplication(); // Refresh data

    } catch (error: any) {
        addToast({
            title: t("errors.updateFailed"),
            description: error.message,
            variant: "destructive"
        });
    } finally {
        setLoading(false);
    }
  };

  // Helper for error message
  const ErrorMsg = ({ error, type }: { error?: any, type?: string }) => {
      if (!error) return null;
      let message = tForm("errors.required");
      if (type === 'pattern' || error.type === 'pattern') {
          if (error.ref?.name?.includes('email')) message = tForm("errors.email");
          else if (error.ref?.name?.includes('phone')) message = tForm("errors.phoneFormat");
          else message = tForm("errors.required"); 
      }
      return <p className="text-red-500 text-sm mt-1">{message}</p>;
  };

  if (loading && !appData) {
    return <div className="flex justify-center py-20"><Loader2 className="animate-spin h-10 w-10 text-primary" /></div>;
  }

  if (!appData) return null;

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-primary">{t("title")}</h1>
        
        {!isEditing && (
            <Button onClick={() => setIsEditing(true)} variant="outline" className="gap-2">
                <Edit2 className="w-4 h-4" /> {t("editTeam")}
            </Button>
        )}
      </div>

      {/* Application Details (Read Only) */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 grid md:grid-cols-2 gap-6">
        <div>
            <Label className="text-gray-500 mb-2 block">{t("teamName")}</Label>
            <p className="text-lg font-semibold">{appData.team_name}</p>
        </div>
        <div>
            <Label className="text-gray-500 mb-2 block">{t("track")}</Label>
            <p className="text-lg font-semibold capitalize">{tTracks(appData.track)}</p>
        </div>
        <div>
            <Label className="text-gray-500 mb-2 block">{t("ideaTitle")}</Label>
            <p className="text-lg font-semibold">{appData.idea_title}</p>
        </div>
        <div className="md:col-span-2">
            <Label className="text-gray-500 mb-2 block">{t("ideaDescription")}</Label>
            <p className="text-md text-gray-700 mt-1 whitespace-pre-wrap">{appData.idea_description}</p>
        </div>
      </div>

      {/* Members Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-primary">{t("members")}</h2>
            
        </div>

        <div className="grid gap-4">
            {fields.map((field, index) => {
                return (
                    <div key={field.id} className={`bg-gray-50 p-6 rounded-xl border relative transition-all duration-200 ${isEditing ? 'border-blue-200 shadow-sm' : 'border-gray-200'}`}>
                        
                        <div className="grid md:grid-cols-2 gap-4">
                            {/* Member Number / Leader Badge */}
                            <div className="md:col-span-2 flex items-center gap-2 mb-2">
                                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                    {index + 1}
                                </div>
                                {watch(`members.${index}.isLeader`) && (
                                    <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full font-medium flex items-center gap-1">
                                        <User className="w-3 h-3" /> {t("leader")}
                                    </span>
                                )}
                            </div>

                            {/* Name AR */}
                            <div>
                                <Label className="mb-2 block">{tForm("nameAr")}</Label>
                                <Input 
                                    disabled={!isEditing} 
                                    {...register(`members.${index}.nameAr`, { required: true })}
                                    className={errors.members?.[index]?.nameAr ? "!border-red-500" : (isEditing && watch(`members.${index}.nameAr`) ? "!border-green-500" : "")}
                                    dir="rtl"
                                />
                                {isEditing && <ErrorMsg error={errors.members?.[index]?.nameAr} />}
                            </div>

                            {/* Name EN */}
                            <div>
                                <Label className="mb-2 block">{tForm("nameEn")}</Label>
                                <Input 
                                    disabled={!isEditing} 
                                    {...register(`members.${index}.nameEn`, { required: true })}
                                    className={errors.members?.[index]?.nameEn ? "!border-red-500" : (isEditing && watch(`members.${index}.nameEn`) ? "!border-green-500" : "")}
                                    dir="ltr"
                                />
                                {isEditing && <ErrorMsg error={errors.members?.[index]?.nameEn} />}
                            </div>

                             {/* Phone */}
                             <div>
                                <Label className="mb-2 block">{tForm("phone")}</Label>
                                <Input 
                                    disabled={!isEditing} 
                                    {...register(`members.${index}.phone`, { required: true, pattern: /^9665\d{8}$/ })}
                                    className={errors.members?.[index]?.phone ? "!border-red-500" : (isEditing && watch(`members.${index}.phone`) ? "!border-green-500" : "")}
                                    placeholder="9665XXXXXXXX"
                                />
                                {isEditing && <ErrorMsg error={errors.members?.[index]?.phone} type="pattern" />}
                            </div>

                            {/* Email */}
                            <div>
                                <Label className="mb-2 block">{tForm("email")}</Label>
                                <Input 
                                    disabled={!isEditing || watch(`members.${index}.isLeader`)} 
                                    {...register(`members.${index}.email`, { required: true, pattern: /^\S+@\S+$/i })}
                                    className={errors.members?.[index]?.email ? "!border-red-500" : (isEditing && !watch(`members.${index}.isLeader`) && watch(`members.${index}.email`) ? "!border-green-500" : "")}
                                />
                                {isEditing && <ErrorMsg error={errors.members?.[index]?.email} type="pattern" />}
                            </div>

                             {/* University */}
                             <div>
                                <Label className="mb-2 block">{tForm("university")}</Label>
                                {isEditing ? (
                                    <Select 
                                        value={watch(`members.${index}.university`)} 
                                        onValueChange={(val) => setValue(`members.${index}.university`, val)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder={tForm("placeholders.university")} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {UNIVERSITY_OPTIONS.map(opt => (
                                                <SelectItem key={opt.value} value={opt.value}>
                                                    {tForm(`universities.${opt.value}`)}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                ) : (
                                    <Input disabled value={tForm(`universities.${watch(`members.${index}.university`)}`)} />
                                )}
                            </div>

                            {/* Uni ID (if KAU) */}
                            {watch(`members.${index}.university`) === 'kau' && (
                                <div>
                                    <Label className="mb-2 block">{tForm("uniId")}</Label>
                                    <Input 
                                        disabled={!isEditing} 
                                        {...register(`members.${index}.uniId`, { required: true })}
                                        className={errors.members?.[index]?.uniId ? "!border-red-500" : (isEditing && watch(`members.${index}.uniId`) ? "!border-green-500" : "")}
                                    />
                                    {isEditing && <ErrorMsg error={errors.members?.[index]?.uniId} />}
                                </div>
                            )}

                             {/* Other Uni Name */}
                             {watch(`members.${index}.university`) === 'other' && (
                                <div>
                                    <Label className="mb-2 block">{tForm("otherUniversity")}</Label>
                                    <Input 
                                        disabled={!isEditing} 
                                        {...register(`members.${index}.otherUniversity`, { required: true })}
                                        className={errors.members?.[index]?.otherUniversity ? "!border-red-500" : (isEditing && watch(`members.${index}.otherUniversity`) ? "!border-green-500" : "")}
                                    />
                                    {isEditing && <ErrorMsg error={errors.members?.[index]?.otherUniversity} />}
                                </div>
                            )}

                             {/* Major */}
                             <div>
                                <Label className="mb-2 block">{tForm("major")}</Label>
                                <Input 
                                    disabled={!isEditing} 
                                    {...register(`members.${index}.major`, { required: true })}
                                    className={errors.members?.[index]?.major ? "!border-red-500" : (isEditing && watch(`members.${index}.major`) ? "!border-green-500" : "")}
                                />
                                {isEditing && <ErrorMsg error={errors.members?.[index]?.major} />}
                            </div>

                        </div>
                        
                        {/* Remove Button Standalone at bottom of card */}
                        {isEditing && fields.length > 3 && !watch(`members.${index}.isLeader`) && (
                            <div className="mt-4 flex justify-end pt-4 border-t border-gray-100">
                                <Button 
                                    onClick={() => remove(index)}
                                    variant="destructive"
                                    size="sm"
                                    className="gap-2"
                                >
                                    <Trash2 className="w-4 h-4" /> {t("removeMember")}
                                </Button>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
                    {isEditing && fields.length < 5 && (
                 <Button 
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => append({
                        nameAr: "",
                        nameEn: "",
                        phone: "",
                        email: "",
                        university: "",
                        uniId: "",
                        major: "",
                        isLeader: false,
                        gender: appData.members[0]?.gender
                    })} 
                    className="gap-2"
                >
                    <Plus className="w-4 h-4" /> {t("addMember")}
                </Button>
            )}
      </div>

      {/* Footer Actions (Only in Edit Mode) */}
      {isEditing && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-10 flex justify-end gap-4 container mx-auto">
            <Button onClick={() => setIsEditing(false)} variant="ghost" size="lg" className="px-8 text-gray-500 hover:text-gray-700" disabled={loading}>
                {t("cancel")}
            </Button>
            <Button onClick={handleSubmit(handleSave)} size="lg" className="px-8 gap-2 bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20" disabled={loading}>
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />} 
                {loading ? tForm("submitting") : t("saveChanges")}
            </Button>
        </div>
      )}
    </div>
  );
}
