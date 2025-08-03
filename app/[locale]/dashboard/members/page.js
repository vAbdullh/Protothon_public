'use client';

import React, { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { Venus, Mars } from 'lucide-react'

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

    return (
        <div>
            <h1>Admin Dashboard - members</h1>
            <button disabled={loading} onClick={fetchTeamOverview} className='bg-blue-500 text-white px-4 py-2 rounded my-2'>
                {loading ? 'Loading...' : 'Fetch members Overview'}
            </button>
            {error && <p style={{ color: 'red' }}>Error: {error}</p>}
            {data && data.map((item) => (
                <div key={item.member_id} className='border p-4 mb-4 flex justify-between items-center'>
                    <h2>{item.name_en}</h2>
                    <p>{item.name_ar}</p>
                    {item.gender == 'male' ? <p className='text-blue-500'><Mars /></p> : <p className='text-pink-500'><Venus /></p>}
                    <p>{item.email}</p>
                    <p>{item.phone}</p>
                    <p>{item.university}</p>
                    <p>{item.major}</p>
                    <p>{item.university_id ? item.university_id : <span className="text-gray-400 italic tracking-wider">N/A</span>}</p>
                    <p>{item.is_leader ? 'Leader' : 'Member'}</p>
                </div>
            ))}
        </div>
    )
}
