'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { H1 } from '@/components/shadcn/typography-h1';
import { Button } from '@/components/shadcn/button';
import { useTranslations } from 'next-intl';
import { useRouter, useParams } from 'next/navigation';
import Loader from '@/components/admin/loader';

export default function ApplicationDetails() {
  const [application, setApplication] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
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

  const t = {
    labels: useTranslations('labels'),
    shared: useTranslations('shared'),
    messages: useTranslations('messages'),
    headings: useTranslations('headings')
  };

  useEffect(() => {
    if (applicationId) {
      fetchApplicationDetails();
    }
  }, [applicationId]);

  if (loading) return <Loader />;
  if (error) return <p className="text-red-500">Error: {error}</p>;
  if (!application) return <p>{t.messages('noApplicationFound')}</p>;

  return (
    <div className="p-6 flex flex-col space-y-8">
      <div className="flex justify-between items-center">
        <H1>{t.headings('applicationDetails')}</H1>
        <Button
          variant="outline"
          onClick={() => router.push('/dashboard/applications')}
        >
          {t.shared('backToList')}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h2 className="text-xl font-bold">{t.labels('basicInfo')}</h2>
          <div className="space-y-2">
            <p><span className="font-semibold">{t.labels('teamName')}:</span> {application.team_name}</p>
            <p><span className="font-semibold">{t.labels('track')}:</span> {application.track}</p>
            <p><span className="font-semibold">{t.labels('ideaTitle')}:</span> {application.idea_title}</p>
            <p><span className="font-semibold">{t.labels('ideaDescription')}:</span> {application.idea_description}</p>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-bold">{t.labels('teamInfo')}</h2>
          <div className="space-y-2">
            <p><span className="font-semibold">{t.labels('leader')}:</span> {application.leader_name_en} ({application.leader_name_ar})</p>
            <p><span className="font-semibold">{t.labels('members')}:</span> {application.member_count}</p>
            <p><span className="font-semibold">{t.labels('createdAt')}:</span> {new Date(application.application_created_at).toLocaleString()}</p>
            <p><span className="font-semibold">{t.labels('status')}:</span> 
              <span className={`inline-block ml-2 px-2 py-1 rounded-sm text-xs capitalize font-semibold ${application.status === 'approved' ? 'bg-green-200 text-green-800' : application.status === 'rejected' ? 'bg-red-200 text-red-800' : 'bg-yellow-200 text-yellow-800'}`}>
                {application.status}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
