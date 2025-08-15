'use client';

import React, { useEffect, useState } from 'react';
import { DashboardTable } from '@/components/admin/dashboard-table';
import { supabase } from '@/lib/supabaseClient';
import { University } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { H1 } from '@/components/shadcn/typography-h1';
import { Button } from '@/components/shadcn/button';
import Loader from '@/components/admin/loader';

export default function Page() {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const t = {
    labels: useTranslations('labels'),
    shared: useTranslations('shared'),
    messages: useTranslations('messages'),
    headings: useTranslations('headings')
  };

  const fetchMembers = async () => {
    setLoading(true);
    setError(null);
    setData(null);
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        throw new Error('Not authenticated')
      }

      const response = await fetch('/api/admin/members', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      })
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const result = await response.json()
      setData(result)
      setError(null)
    } catch (err) {
      setError(err.message)
      setData(null)
    } finally {
      setLoading(false)
    }
  }

  const columns = [
    { key: 'name_en', label: t.labels('nameEn'), type: 'text' },
    { key: 'name_ar', label: t.labels('nameAr'), type: 'text' },
    { key: 'gender', label: t.labels('gender'), type: 'gender' },
    { key: 'email', label: t.labels('email'), type: 'text' },
    { key: 'university', label: t.labels('university'), type: 'text' },
    { key: 'major', label: t.labels('major'), type: 'text' },
    { key: 'university_id', label: t.labels('universityId'), type: 'text' },
  ];

  useEffect(() => {
    fetchMembers();
  }, []);

  return (
    <div className="p-6 flex flex-col space-y-8">
      <H1>{t.headings('membersList')}</H1>
      <Button disabled={loading} variant='default' className='w-fit self-end' onClick={fetchMembers}>
        {loading ? t.shared('loading') : t.shared('refresh')}
      </Button>
      {error && <p className="text-red-500">Error: {error}</p>}
      {data && data.length > 0 ? (
        <DashboardTable data={data} columns={columns} />
      ) : (
        loading ? <Loader /> : <p>{t.messages('noMembersFound')}</p>
      )}
    </div>
  );
}
