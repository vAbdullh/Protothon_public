import { supabaseAdmin } from '@/lib/supabase-admin'
import { headers } from 'next/headers'
import { NextResponse } from 'next/server'

export async function verifyAdminUser() {
  const headersList = headers()
  const authHeader = (await headersList).get('authorization')
  const token = authHeader?.split(' ')[1]

  if (!token) {
    return {
      error: 'Authorization token missing',
      status: 401,
    }
  }

  const { data: { user }, error } = await supabaseAdmin.auth.getUser(token)

  if (error || !user) {
    return {
      error: 'Invalid or missing user',
      status: 401,
    }
  }

//   // Optional: check if the user is really an admin (by role or email)
//   const { data: userData, error: userError } = await supabaseAdmin
//     .from('users')
//     .select('role')
//     .eq('id', user.id)
//     .single()

//   if (userError || userData?.role !== 'admin') {
//     return {
//       error: 'Admin access required. Maybe if you say "please"? 🚧',
//       status: 403,
//     }
//   }

  return { user }
}
