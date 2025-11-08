import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function POST(request: NextRequest) {
  try {
    // Parse form data instead of JSON to handle file upload
    const formData = await request.formData();
    
    // Extract form fields
    const teamName = formData.get('teamName') as string;
    const track = formData.get('track') as string;
    const ideaTitle = formData.get('ideaTitle') as string;
    const ideaDescription = formData.get('ideaDescription') as string;
    const attachment = formData.get('attachment') as File;
    const membersJson = formData.get('members') as string;

    // Parse members data
    const members = JSON.parse(membersJson);

    // Validate required fields
    if (!teamName || !track || !ideaTitle || !ideaDescription || !members) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Validate members data
    const leader = members.find((m: any) => m.isLeader);
    if (!leader) {
      return NextResponse.json({ error: "No team leader specified" }, { status: 400 });
    }

    for (const member of members) {
      if (!member.nameAr || !member.nameEn || !member.phone || !member.email || !member.university || !member.major) {
        return NextResponse.json({ error: "Member details are incomplete" }, { status: 400 });
      }
    }

    let fileUrl = null;

    // Handle file upload if attachment exists
    if (attachment && attachment.size > 0) {
      // Validate file type and size
      if (attachment.type !== 'application/pdf') {
        return NextResponse.json({ error: "Only PDF files are allowed" }, { status: 400 });
      }

      if (attachment.size > 100 * 1024 * 1024) {
        return NextResponse.json({ error: "File size must be less than 100MB" }, { status: 400 });
      }

      // Generate unique file name
      const fileExtension = attachment.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExtension}`;
      const filePath = `applications/${fileName}`;

      // Upload file to Supabase storage using admin client
      const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
        .from('attachments_bucket')
        .upload(filePath, attachment, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error("Error uploading file:", uploadError);
        return NextResponse.json({ error: "Failed to upload file" }, { status: 500 });
      }

      // Get public URL for the uploaded file
      const { data: { publicUrl } } = supabaseAdmin.storage
        .from('attachments_bucket')
        .getPublicUrl(filePath);

      fileUrl = publicUrl;
      console.log('✅ File uploaded successfully:', fileUrl);
    }

    // Transform members data for database (similar to the auth endpoint)
    const resolvedMembers = members.map((member: any) => {
      let universityName = member.university;

      // If university is "other", use the otherUniversity field
      if (member.university === 'other' && member.otherUniversity) {
        universityName = member.otherUniversity;
      } else if (member.university === 'kau') {
        universityName = 'King Abdulaziz University';
      }

      return {
        name_ar: member.nameAr,
        name_en: member.nameEn,
        gender: member.gender,
        phone: member.phone,
        email: member.email,
        university: universityName,
        university_id: member.uniId || null,
        major: member.major,
        is_leader: member.isLeader || false
      };
    });

    // Insert members first
    const { data: insertedMembers, error: membersError } = await supabaseAdmin
      .from('members')
      .insert(resolvedMembers)
      .select();

    if (membersError) {
      console.error("Error inserting members:", membersError);
      return NextResponse.json({ error: "Failed to create team members" }, { status: 500 });
    }

    // Find the leader's ID
    const leaderMember = insertedMembers.find((m: any) => 
      m.email === leader.email && 
      m.name_en === leader.nameEn
    );

    if (!leaderMember) {
      return NextResponse.json({ error: "Failed to identify team leader" }, { status: 500 });
    }

    // Insert application with leader_id - no updated_by since it's public
    const { data: insertedApplication, error: applicationError } = await supabaseAdmin
      .from('applications')
      .insert([{
        team_name: teamName,
        track: track,
        idea_title: ideaTitle,
        idea_description: ideaDescription,
        leader_id: leaderMember.id,
        status: 'pending'
        // updated_by is omitted for public submissions
      }])
      .select();

    if (applicationError) {
      console.error("Error inserting application:", applicationError);
      return NextResponse.json({ error: "Failed to create application" }, { status: 500 });
    }

    const applicationId = insertedApplication[0].id;

    // Insert application_members relationships
    const applicationMembersData = insertedMembers.map(member => ({
      application_id: applicationId,
      member_id: member.id
    }));

    const { error: applicationMembersError } = await supabaseAdmin
      .from('application_members')
      .insert(applicationMembersData);

    if (applicationMembersError) {
      console.error("Error linking members to application:", applicationMembersError);
      // Don't fail the request, just log the error
    }

    // Insert attachments if file was uploaded
    if (fileUrl) {
      const { error: attachmentsError } = await supabaseAdmin
        .from('application_attachments')
        .insert([{
          application_id: applicationId,
          file_url: fileUrl
        }]);

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
