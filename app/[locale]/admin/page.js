'use client';

import React, { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function Page() {
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const fetchTeamOverview = async () => {
    setLoading(true);
    setError(null);
    setData(null);
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        throw new Error('Not authenticated')
      }

      const response = await fetch('/api/admin/applications', {
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
 const exampleData =   {
    "team_id": "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
    "team_name": "dev_team_beta",
    "track": "Web",
    "idea_title": "Fast Web",
    "status": "approved",
    "leader_id": "22222222-2222-2222-2222-222222222222",
    "leader_name_en": "Dev User Two",
    "leader_name_ar": "مستخدم تجريبي اثنين",
    "team_created_at": "2025-07-26T14:44:58.336409",
    "member_count": 1
  }
  return (
    <div>
      <h1>Admin Dashboard</h1>
      <button disabled={loading} onClick={fetchTeamOverview} className='bg-blue-500 text-white px-4 py-2 rounded my-2'>
        {loading ? 'Loading...' : 'Fetch Team Overview'}
      </button>
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      {/* {data && <pre>{JSON.stringify(data, null, 2)}</pre>} */}
      {data && data.map((item)=>(
        <div key={item.team_id} className='border p-4 mb-4 flex justify-between items-center'>
          <h2>{item.team_name}</h2>
          <p>Track: {item.track}</p>
          <p>Idea Title: {item.idea_title}</p>
          <p>Status: {item.status}</p>
          <p>Leader: {item.leader_name_en} ({item.leader_name_ar})</p>
          <p>Members: {item.member_count}</p>
          <p>Created At: {new Date(item.team_created_at).toLocaleString()}</p>
        </div>
      ))}
    </div>
  )
}
