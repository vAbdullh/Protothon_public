'use client';

import React, { useEffect, useState } from 'react';
import { DashboardTable } from '@/components/admin/dashboard-table'; // Your reusable component path
import { supabase } from '@/lib/supabaseClient';
import { University } from 'lucide-react';
import { H1 } from '@/components/shadcn/typography-h1';
import { Button } from '@/components/shadcn/button';

export default function Page() {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

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
    { key: 'name_en', label: 'Name (EN)', type: 'text' },
    { key: 'name_ar', label: 'Name (AR)', type: 'text' },
    { key: 'gender', label: 'Gender', type: 'gender' },
    { key: 'email', label: 'Email', type: 'text' },
    { key: 'university', label: 'University', type: 'text' },
    { key: 'major', label: 'Major', type: 'text' },
    { key: 'university_id', label: 'University ID', type: 'text' },
  ];

  useEffect(() => {
    fetchMembers();
  }, []);

  return (
    <div className="p-6 flex flex-col space-y-8">
      <H1>Members List</H1>
      <Button disabled={loading} variant='default' className='w-fit self-end' onClick={fetchMembers}>{loading ? 'loading...' : 'Refresh'}</Button>
      {error && <p className="text-red-500">Error: {error}</p>}
      {data && data.length > 0 ? (
        <DashboardTable data={data} columns={columns} />
      ) : (
        loading ? <p>Loading...</p> : <p>No members found.</p>
      )}
    </div>
  );
}
