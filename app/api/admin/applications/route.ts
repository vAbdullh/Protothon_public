import { supabaseAdmin } from '@/lib/supabase-admin'
import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { verifyAdminUser } from '@/lib/verify-admin-user'

async function verifyAdmin() {
  const headersList = await headers()
  const authHeader = headersList.get('authorization')
  const token = authHeader?.split(' ')[1]

  if (!token) {
    return { error: 'Authorization token missing', status: 401 }
  }

  const { data: { user }, error } = await supabaseAdmin.auth.getUser(token)
  
  if (error) {
    return { error: 'Invalid token', status: 401 }
  }

  return { user }
}

export async function GET() {
 const auth = await verifyAdminUser()
  if (auth.error) {
    return NextResponse.json({ error: auth.error }, { status: auth.status })
  }

  try {
    const { data, error } = await supabaseAdmin
      .from('team_overview')
      .select('*')

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json(data)
  } catch (err) {
    return NextResponse.json(
      { error: 'Failed to fetch team overview' },
      { status: 500 }
    )
  }
}
