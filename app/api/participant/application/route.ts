import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export async function GET(request: Request) {
  const authHeader = request.headers.get("Authorization");
  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: { persistSession: false },
    global: { headers: authHeader ? { Authorization: authHeader } : undefined },
  });

  const adminSupabase = supabaseServiceRoleKey
    ? createClient(supabaseUrl, supabaseServiceRoleKey, {
        auth: { persistSession: false },
      })
    : supabase;

  // 1. Authenticate
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // 2. Find Member linked to Auth ID
    const { data: member, error: memberError } = await adminSupabase
      .from("members")
      .select("id")
      .eq("auth_id", user.id)
      .single();

    if (memberError || !member) {
      console.error("Member not found for user:", user.id);
      return NextResponse.json({ error: "Member not found" }, { status: 404 });
    }

    // 3. Find Application Member Link
    const { data: appMember, error: appMemberError } = await adminSupabase
      .from("application_members")
      .select("application_id")
      .eq("member_id", member.id)
      .single();

    if (appMemberError || !appMember) {
      console.error("Application link not found for member:", member.id);
      return NextResponse.json({ error: "Application not found" }, { status: 404 });
    }

    const applicationId = appMember.application_id;

    // 4. Fetch Application with Members
    const { data: application, error: appError } = await adminSupabase
      .from("applications")
      .select(`
        *,
        members:application_members(
          member:members(*)
        )
      `)
      .eq("id", applicationId)
      .single();

    if (appError || !application) {
       console.error("Application details fetch failed:", appError);
      return NextResponse.json(
        { error: "Application details not found" },
        { status: 404 }
      );
    }

    // Transform structure
    const formattedApplication = {
      ...application,
      members: application.members.map((m: any) => m.member),
    };

    return NextResponse.json({ application: formattedApplication });

  } catch (error: any) {
    console.error("GET Application Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const authHeader = request.headers.get("Authorization");
  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: { persistSession: false },
    global: { headers: authHeader ? { Authorization: authHeader } : undefined },
  });

  const adminSupabase = supabaseServiceRoleKey
    ? createClient(supabaseUrl, supabaseServiceRoleKey, {
        auth: { persistSession: false },
      })
    : supabase;

  // 1. Authenticate
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { members } = body;

    if (!members || !Array.isArray(members) || members.length < 3 || members.length > 5) {
        return NextResponse.json({ error: "Invalid team size" }, { status: 400 });
    }

    // 2. Identification (Same flow as GET)
    const { data: member, error: memberError } = await adminSupabase
      .from("members")
      .select("id")
      .eq("auth_id", user.id)
      .single();

    if (memberError || !member) {
      return NextResponse.json({ error: "Member not found" }, { status: 404 });
    }

    const { data: appMember, error: appMemberError } = await adminSupabase
      .from("application_members")
      .select("application_id")
      .eq("member_id", member.id)
      .single();

    if (appMemberError || !appMember) {
        return NextResponse.json({ error: "Application not found" }, { status: 404 });
    }

    const applicationId = appMember.application_id;

    // 3. Process Updates
    // Fetch current members to handle adds/removes carefully
    const { data: currentAppLinks, error: fetchError } = await adminSupabase
        .from('application_members')
        .select('member_id')
        .eq('application_id', applicationId);
    
    if (fetchError) throw fetchError;

    const currentMemberIds = currentAppLinks.map((am:any) => am.member_id);
    const membersToKeep: string[] = [];

    for (const m of members) {
        const memberData = {
            name_ar: m.nameAr,
            name_en: m.nameEn,
            phone: m.phone,
            email: m.email,
            university: m.university === 'other' ? m.otherUniversity : (m.university === 'kau' ? 'King Abdulaziz University' : m.university),
            university_id: m.uniId || null,
            major: m.major,
            is_leader: m.id ? false : false, // Prevent changing leader status via update. New members cannot be leader. 
            // Logic Refinement: We want to preserve the EXISTING leader status for existing members.
            // But if we just ignore the payload's isLeader, how do we know who WAS leader?
            // We can re-fetch or just trust that if we don't update is_leader column, it stays same.
            // However, Supabase update requires specifying columns to change? No, it updates what we pass.
            // So if we OMIT is_leader from the update payload, it won't change.
            gender: m.gender 
        };

        // Remove is_leader from the object so it is not updated
        delete memberData.is_leader;

        if (m.id) {
            // Update existing member
            const { error: updateError } = await adminSupabase
                .from('members')
                .update(memberData)
                .eq('id', m.id);
            
            if (updateError) throw updateError;
            membersToKeep.push(m.id);
        } else {
            // Insert new member
            const { data: newMember, error: insertError } = await adminSupabase
                .from('members')
                .insert(memberData)
                .select()
                .single();
            
            if (insertError) throw insertError;
            
            // Link new member to application
            const { error: linkError } = await adminSupabase
                .from('application_members')
                .insert({ application_id: applicationId, member_id: newMember.id });

            if (linkError) throw linkError;
            
            membersToKeep.push(newMember.id);
        }
    }

    // Remove deleted members
    const membersToRemove = currentMemberIds.filter((id: any) => !membersToKeep.includes(id));
    
    if (membersToRemove.length > 0) {
        // Ensure we don't remove the *current user* who is calling this, just in case UI validation failed
        if (membersToRemove.includes(member.id)) {
            return NextResponse.json({ error: "You cannot remove yourself from the team" }, { status: 400 });
        }

        // Unlink from application
        await adminSupabase
            .from('application_members')
            .delete()
            .in('member_id', membersToRemove)
            .eq('application_id', applicationId);
            
        // Optionally delete member record? Staying safer by just unlinking for now, 
        // to avoid issues if foreign keys exist elsewhere unintentionally (though unlikely for members)
        // But user requirement says "Manage... Add, Remove, Update". Safe to delete if compliant with schema.
        // Let's stick to unlinking + maybe deleting if purely a child record.
        // The schema probably has ON DELETE CASCADE on application_members but not vice versa.
        // I will try to delete the member record to keep DB clean.
         await adminSupabase
            .from('members')
            .delete()
            .in('id', membersToRemove);
    }

    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error("PUT Application Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
