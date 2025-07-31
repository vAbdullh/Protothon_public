import { supabaseAdmin } from '@/lib/supabase-admin'
import { NextResponse } from 'next/server'
import { verifyAdminUser } from '@/lib/verify-admin-user'

export async function POST(_: Request, { params }: { params: { id: string } }) {
  const auth = await verifyAdminUser()
  if (auth.error) {
    return NextResponse.json({ error: auth.error }, { status: auth.status })
  }

  const { id } = params

  const { error } = await supabaseAdmin
    .from('teams') 
    .update({ status: 'approved' })
    .eq('id', id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ message: `Application ${id} approved` })
}
