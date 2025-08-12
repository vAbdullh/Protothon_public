'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/shadcn/button';
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

  useEffect(() => {
    if (applicationId) {
      fetchApplicationDetails();
    }
  }, [applicationId]);

  if (loading) return <Loader />;

  if (error) {
    return (
      <div className="p-6">
        <h1 className="text-xl font-bold">Error</h1>
        <p className="text-red-500">{error}</p>
        <Button
          variant="outline"
          onClick={() => router.push('/dashboard/applications')}
          className="mt-4"
        >
          Back to Applications
        </Button>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="p-6">
        <h1 className="text-xl font-bold">Not Found</h1>
        <p>Application not found</p>
        <Button
          variant="outline"
          onClick={() => router.push('/dashboard/applications')}
          className="mt-4"
        >
          Back to Applications
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold">Application Details</h1>
        <Button
          variant="default"
          onClick={() => router.push('/dashboard/applications')}
        >
          Back to List
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <p>Team Name: {application.team_name}</p>
        <p>Track: {application.track}</p>
        <p>Idea Title: {application.idea_title}</p>
        <p>Description: {application.idea_description}</p>
        <p>Leader: {application.leader_name_en} ({application.leader_name_ar})</p>
        <p>Created: {new Date(application.application_created_at).toLocaleString()}</p>
        <p>Status: {application.status} </p>
        <hr className='border-4 col-span-2'/>
        {application.members?.length > 0 && (
            <div className='space-y-10'>
              {application.members.map((member) => (
                <div key={member.member_id}>
                  <p>Name: {member.member_name_en} ({member.member_name_ar})</p>
                  <p>Email: {member.member_email}</p>
                  <p>Phone: {member.member_phone}</p>
                  <p>University: {member.university}</p>
                  <p>Major: {member.major}</p>
                </div>
              ))}
            </div>
        )}
      </div>
    </div>
  );
}
