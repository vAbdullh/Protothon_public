import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

// We need a server-side client to access the view securely, 
// though the client helper is preferred in Next.js App Router for auth context.
// However, standard createClient is fine if we pass the cookies or just rely on the session if we use the helper.
// Actually, `npm install @supabase/ssr` is the new way, but sticking to what's likely used or just `createClient` if we have SERVICE_ROLE for writing (if RLS blocks)
// But wait, the user provided `user_metadata` logic before.
// Let's use standard Supabase client creation from env vars for simplicity unless `lib/supabaseClient` exposes a helper.
// The user has `lib/supabaseClient` which is likely client-side.
// We should use `createRouteHandlerClient` if available, or just standard REST via `supabase-js`.
// Let's check `lib/supabaseClient` content first? No, I'll assume standard pattern.
// Wait, I don't have `@supabase/auth-helpers-nextjs` installed?
// I will use `createClient` with Env vars which usually has admin rights if using valid service key, BUT we need to identify the user.
// BETTER: Get user from the request using the `supabase-js` client initialized with the request headers (Authorization). 
// OR: Just trust `supabase.auth.getUser()`.

// Let's assume we can import `supabase` from the shared lib, but that might be a client version.
// I'll create a new client here to be safe and ensure we can read the view.

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
// Try to use Service Role Key for admin-level access (bypassing RLS)
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export async function GET(request: Request) {
    const authHeader = request.headers.get('Authorization');
    // Client for Auth (identifying the user) via Anon Key
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: { persistSession: false },
      global: { headers: authHeader ? { Authorization: authHeader } : undefined }
    });

    // Client for Database (using Service Role if available to ensure we can read 'members')
    const adminSupabase = supabaseServiceRoleKey 
        ? createClient(supabaseUrl, supabaseServiceRoleKey, { auth: { persistSession: false } })
        : supabase;

    // 1. Authenticate
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
        console.error("Auth Error (GET):", authError);
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        // 2. Find Member ID
        const { data: member, error: memberError } = await adminSupabase
            .from("members")
            .select("id")
            .eq("auth_id", user.id)
            .single();

        if (memberError || !member) {
             console.error("Member Lookup Error (GET):", memberError, "User ID:", user.id);
             return NextResponse.json({ error: "Member not found" }, { status: 404 });
        }

        // 3. Find Team ID (Application ID)
        const { data: appMember, error: appMemberError } = await adminSupabase
            .from("application_members")
            .select("application_id")
            .eq("member_id", member.id)
            .single();

        if (appMemberError || !appMember) {
             console.error("Team/Application Lookup Error (GET):", appMemberError, "Member ID:", member.id);
             return NextResponse.json({ error: "Team not found for member" }, { status: 404 });
        }

        const team_id = appMember.application_id;

        // 4. Fetch All Active Tasks (The "Questions")
        const { data: allTasks, error: tasksError } = await adminSupabase
            .from("submissions")
            .select("id, title, description, deadline")
            .eq("is_active", true);

        if (tasksError) {
             console.error("Error fetching tasks:", tasksError);
             throw tasksError;
        }

        // 5. Fetch Team's Existing Responses
        const { data: teamResponses, error: responsesError } = await adminSupabase
            .from("team_submissions")
            .select("submission_id, file_url, submitted_at")
            .eq("team_id", team_id);
            
        if (responsesError) {
             console.error("Error fetching team responses:", responsesError);
             // Don't fail completely, just show tasks with no status?
             // throw responsesError; 
        }

        // 6. Merge Data
        const submissions = allTasks?.map(task => {
            const response = teamResponses?.find(r => r.submission_id === task.id);
            
            // Determine status
            let status = "pending";
             if (response) {
                status = "submitted";
            } else if (new Date() > new Date(task.deadline)) {
                status = "passed";
            }

            return {
                submission_id: task.id,
                title: task.title,
                description: task.description,
                deadline: task.deadline,
                team_id: team_id,
                file_url: response?.file_url || null,
                submitted_at: response?.submitted_at || null,
                status: status
            };
        }) || [];

        return NextResponse.json({ submissions });

    } catch (error: any) {
        console.error("GET Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}


