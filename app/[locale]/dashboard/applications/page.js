'use client';

import React, { useState } from 'react';
import { DashboardTable } from '@/components/admin/dashboard-table';
import { supabase } from '@/lib/supabaseClient';
import { H1 } from '@/components/shadcn/typography-h1';
import { Button } from '@/components/shadcn/button';

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
  const columns = [
    { key: 'team_name', label: 'Team Name', type: 'text' },
    { key: 'track', label: 'Track', type: 'text' },
    { key: 'idea_title', label: 'Idea Title', type: 'text' },
    { key: 'leader', label: 'Leader', type: 'text' },
    { key: 'member_count', label: 'Members', type: 'text' },
    { key: 'created_at', label: 'Created At', type: 'date' },
    { key: 'status', label: 'Status', type: 'status' },
  ];

  return (
    <div className="p-6 flex flex-col space-y-8">
      <H1>Applications</H1>
      <Button 
        disabled={loading} 
        variant="default" 
        className="w-fit self-end" 
        onClick={fetchTeamOverview}
      >
        {loading ? 'Loading...' : 'Refresh'}
      </Button>
      {error && <p className="text-red-500">Error: {error}</p>}
      {data && data.length > 0 ? (
        <DashboardTable data={data} columns={columns} />
      ) : (
        loading ? <p>Loading...</p> : <p>No applications found.</p>
      )}
    </div>
  );
}
