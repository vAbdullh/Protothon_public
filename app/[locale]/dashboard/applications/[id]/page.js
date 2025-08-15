'use client';

import React, { use, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/shadcn/button';
import { useRouter, useParams } from 'next/navigation';
import Loader from '@/components/admin/loader';
import { H3 } from '@/components/shadcn/typography-h3';
import { useLocale, useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader } from '@/components/shadcn/card';
import { Edit2, Undo2 } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/shadcn/avatar';
import { Separator } from '@/components/shadcn/separator';
import StatusBadge from '@/components/admin/status-badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/shadcn/tabs';

export default function ApplicationDetails() {
  const [application, setApplication] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const locale = useLocale();

  const t = {
    labels: useTranslations('labels'),
    shared: useTranslations('shared'),
    errorMessages: useTranslations('errorMessages'),
  }

  const router = useRouter();
  const params = useParams();
  const applicationId = params.id;

  const fetchApplicationDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('Not authenticated');
      }

      const response = await fetch(`/api/admin/applications/${applicationId}`, {
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      setApplication(result);
      setError(null);
    } catch (err) {
      setError(err.message);
      setApplication(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (applicationId) {
      fetchApplicationDetails();
    }
  }, [applicationId]);

  if (loading) return <Loader />;

  if (error) {
    return (
      <Card className="p-6 mx-auto max-w-md flex flex-col items-center gap-2 text-center">
        <H3>{t.errorMessages('errorLoadingApplications')}</H3>
        <Button
          variant="destructive"
          onClick={() => router.push('/dashboard/applications')}
          className='mt-4'
        >
          {t.labels('backApplicationsList')}
        </Button>
        {error &&
          <p className='text-gray-500 text-xs capitalize'>
            {t.errorMessages('errorRef')} {error}
          </p>
        }
      </Card>
    );
  }

  if (!application) {
    return (
      <Card className="p-6 mx-auto max-w-md flex flex-col items-center gap-2">
        <H3>{t.shared('error')}</H3>
        <p>{t.errorMessages('notFound')}</p>
        <Button
          variant="destructive"
          onClick={() => router.push('/dashboard/applications')}
          className='mt-4'
        >
          {t.labels('backApplicationsList')}
        </Button>
      </Card>
    );
  }

  return (
    <div className='space-y-6 py-6'>

      {/* header */}
      <div className='flex gap-3 items-center'>
        <Button variant='outline' className='aspect-square h-full'>
          <Undo2 className='rtl:rotate-y-180' />
        </Button>
        <div className='flex-1'>
          <H3>
            <span className='text-sm text-muted-foreground'>{t.labels('teamName')}</span>
            <span className='px-2.5'>{application.team_name}</span>
          </H3>
          <p className='text-muted-foreground text-sm'>{new Date(application.application_created_at).toLocaleString(locale)}</p>
        </div>
        <Button>{t.shared('edit')} <Edit2 /> </Button>
      </div>

      {/* Idea info */}
      <Card>
        <CardHeader>
          <H3>{t.labels('ideaDetails')}</H3>
        </CardHeader>
        <CardContent className="flex items-center gap-3">
          <Avatar>
            <AvatarFallback>{(application.team_name || 'T').slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className='flex-1'>
            <div className="text-sm font-semibold">{application.team_name}</div>
            <div className="text-xs text-muted-foreground">{application.track}</div>
          </div>
          <StatusBadge status={application.status} />

        </CardContent>
        <Separator />
        <CardContent className='xl:grid grid-cols-2 space-y-5 xl:space-y-10'>
          <div>
            <p className='text-muted-foreground text-xs'>{t.labels('ideaTitle')}</p>
            <p className='text-xl'>{application.idea_title}</p>
          </div>

          <div>
            <p className='text-muted-foreground text-xs'>{t.labels('track')}</p>
            <p className='text-xl'>{application.track}</p>
          </div>

          <div>
            <p className='text-muted-foreground text-xs'>{t.labels('ideaDescription')}</p>
            <p className='text-xl'>{application.idea_description}</p>
          </div>

          <div>
            <p className='text-muted-foreground text-xs'>{t.labels('leader')}</p>
            <p className='text-xl'>{application.leader_name_ar}</p>
            <p className='text-xl'>{application.leader_name_en}</p>
          </div>
        </CardContent>
      </Card>
      <Tabs defaultValue="members">
        <TabsList>
          <TabsTrigger value="attachments">{t.labels('attachments')}</TabsTrigger>
          <TabsTrigger value="members">{t.labels('members')}</TabsTrigger>
        </TabsList>
        <TabsContent value="members" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
          {/* members info */}
          <Card>
            <CardHeader>
              <H3>{t.labels('members')}</H3>
            </CardHeader>
            <Separator />
            <CardContent className='space-y-5 xl:space-y-10'>
              {application.members?.length > 0 ? application.members.map((m) => (
                <div key={m.member_id} className='flex gap-2'>
                  <Avatar><AvatarFallback>{(m.member_name_en || 'U').slice(0, 1).toUpperCase()}</AvatarFallback></Avatar>
                  <div className='flex-1'>
                    <div className='flex items-center gap-2'>
                      <span className="font-medium rtl:text-muted-foreground rtl:order-2">{m.member_name_en}</span>
                      <span className="text-sm text-muted-foreground rtl:text-accent-foreground">{m.member_name_ar}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">{m.major} | {m.member_email} • {m.member_phone}</div>
                  </div>
                  <div className='text-end flex flex-col text-muted-foreground'>
                    <span>{m.university}</span>
                    {m.university_id && <span>{m.university_id}</span>}
                  </div>
                </div>
              )) : <p>{t.errorMessages('membersNotFound')}</p>}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="attachments" dir={locale === 'ar' ? 'rtl' : 'ltr'}>attachments</TabsContent>
      </Tabs>
    </div >
  );
}
