import { supabaseAdmin } from '@/lib/supabase-admin'
import { NextResponse } from 'next/server'
import { verifyAdminUser } from '@/lib/verify-admin-user'

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const auth = await verifyAdminUser()
  if (auth.error) {
    return NextResponse.json({ error: auth.error }, { status: auth.status })
  }

  try {
    const [appDetails, members] = await Promise.all([
      supabaseAdmin
        .from('application_detail')
        .select('*')
        .eq('application_id', params.id)
        .maybeSingle(), // Use maybeSingle instead of single to handle no rows case
        
      supabaseAdmin
        .from('application_members_detail')
        .select('*')
        .eq('application_id', params.id)
    ])

    if (appDetails.error) {
      // Handle case where maybeSingle returns error for invalid ID
      if (appDetails.error.message.includes('JSON object requested')) {
        return NextResponse.json({ error: 'Application not found' }, { status: 404 })
      }
      return NextResponse.json({ error: appDetails.error.message }, { status: 500 })
    }

    if (members.error) {
      return NextResponse.json({ error: members.error.message }, { status: 500 })
    }

    if (!appDetails.data) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 })
    }

    return NextResponse.json({
      ...appDetails.data,
      members: members.data || []
    })
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch application details' },
      { status: 500 }
    )
  }
}
