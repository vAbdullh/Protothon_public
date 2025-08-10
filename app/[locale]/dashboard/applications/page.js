'use client';

import React, { use, useEffect, useState } from 'react';
import { DashboardTable } from '@/components/admin/dashboard-table';
import { supabase } from '@/lib/supabaseClient';
import { H1 } from '@/components/shadcn/typography-h1';
import { Button } from '@/components/shadcn/button';
import { useTranslations } from 'next-intl';

export default function Page() {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchTeamOverview = async () => {
    setLoading(true);
    setError(null);
    setData([]);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('Not authenticated');
      }

      const response = await fetch('/api/admin/applications', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      setData(result.map(item => ({
        ...item,
        leader: `${item.leader_name_en} (${item.leader_name_ar})`,
        created_at: item.application_created_at,
        actions: item.application_id
      })));
      setError(null);
    } catch (err) {
      setError(err.message);
      setData([]);
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

  const columns = [
    { key: 'team_name', label: t.labels('teamName'), type: 'text' },
    { key: 'track', label: t.labels('track'), type: 'text' },
    { key: 'idea_title', label: t.labels('ideaTitle'), type: 'text' },
    { key: 'leader', label: t.labels('leader'), type: 'text' },
    { key: 'member_count', label: t.labels('members'), type: 'text' },
    { key: 'created_at', label: t.labels('createdAt'), type: 'date' },
    { key: 'status', label: t.labels('status'), type: 'status' },
  ];

  useEffect(() => {
    fetchTeamOverview();
  }, []);

  return (
    <div className="p-6 flex flex-col space-y-8">
      <H1>{t.headings('applicationsList')}</H1>
      <Button
        disabled={loading}
        variant="default"
        className="w-fit self-end"
        onClick={fetchTeamOverview}
      >
        {loading ? t.shared('loading') : t.shared('refresh')}
      </Button>
      {error && <p className="text-red-500">Error: {error}</p>}
      {data && data.length > 0 ? (
        <DashboardTable data={data} columns={columns} />
      ) : (
        loading ? <p>{t.shared('loading')}</p> : <p>{t.messages('noApplicationsFound')}</p>
      )}
    </div>
  );
}
