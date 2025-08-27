import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function POST(request: NextRequest) {
  try {
    // Parse request body - no authentication required for public submissions
    const body = await request.json();
    const { application, members, attachments } = body;

    if (!application || !members || !attachments) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Validate application data
    if (!application.team_name || !application.track || !application.idea_title || !application.idea_description) {
      return NextResponse.json({ error: "Application details are incomplete" }, { status: 400 });
    }

    // Validate members data
    const leader = members.find(m => m.is_leader);
    if (!leader) {
      return NextResponse.json({ error: "No team leader specified" }, { status: 400 });
    }

    for (const member of members) {
      if (!member.name_ar || !member.name_en || !member.gender || !member.phone || !member.email || !member.university || !member.major) {
        return NextResponse.json({ error: "Member details are incomplete" }, { status: 400 });
      }
    }

    // Insert members first
    const { data: insertedMembers, error: membersError } = await supabaseAdmin
      .from('members')
      .insert(members.map(m => ({
        name_ar: m.name_ar,
        name_en: m.name_en,
        gender: m.gender,
        phone: m.phone,
        email: m.email,
        university: m.university,
        major: m.major,
        university_id: m.university_id
      })))
      .select();

    if (membersError) {
      console.error("Error inserting members:", membersError);
      return NextResponse.json({ error: "Failed to create team members" }, { status: 500 });
    }

    // Find the leader's ID
    const leaderMember = insertedMembers.find(m => 
      m.email === leader.email && 
      m.name_en === leader.name_en
    );

    if (!leaderMember) {
      return NextResponse.json({ error: "Failed to identify team leader" }, { status: 500 });
    }

    // Insert application with leader_id - no updated_by since it's public
    const { data: insertedApplication, error: applicationError } = await supabaseAdmin
      .from('applications')
      .insert([{
        team_name: application.team_name,
        track: application.track,
        idea_title: application.idea_title,
        idea_description: application.idea_description,
        leader_id: leaderMember.id,
        status: application.status || 'pending'
        // updated_by is omitted for public submissions
      }])
      .select();

    if (applicationError) {
      console.error("Error inserting application:", applicationError);
      return NextResponse.json({ error: "Failed to create application" }, { status: 500 });
    }

    const applicationId = insertedApplication[0].id;

    // Insert attachments
    if (attachments.length > 0) {
      const { error: attachmentsError } = await supabaseAdmin
        .from('application_attachments')
        .insert(attachments.map(attachment => ({
          application_id: applicationId,
          file_url: attachment.file_url
        })));

      if (attachmentsError) {
        console.error("Error inserting attachments:", attachmentsError);
        // Don't fail the whole request if attachments fail, just log it
      }
    }

    return NextResponse.json({
      success: true,
      application: insertedApplication[0],
      message: "Application submitted successfully"
    }, { status: 201 });

  } catch (error) {
    console.error("Error in public application submission:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
