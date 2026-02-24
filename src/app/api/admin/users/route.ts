import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getAuthClient(request: Request) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;

  const token = request.headers.get("authorization")?.replace("Bearer ", "");
  if (!token) return null;

  return createClient(url, key, {
    global: { headers: { Authorization: `Bearer ${token}` } },
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

function getServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

/** GET /api/admin/users — list all auth users */
export async function GET(request: Request) {
  const supabase = getAuthClient(request);
  if (!supabase)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const service = getServiceClient();
  if (!service)
    return NextResponse.json(
      { error: "Service role key not configured" },
      { status: 500 }
    );

  const {
    data: { users },
    error,
  } = await service.auth.admin.listUsers();

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });

  // Return only safe fields
  const safeUsers = (users ?? []).map((u) => ({
    id: u.id,
    email: u.email,
    created_at: u.created_at,
    last_sign_in_at: u.last_sign_in_at,
    email_confirmed_at: u.email_confirmed_at,
  }));

  return NextResponse.json(safeUsers);
}

/** POST /api/admin/users — create a new admin user */
export async function POST(request: Request) {
  const supabase = getAuthClient(request);
  if (!supabase)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const service = getServiceClient();
  if (!service)
    return NextResponse.json(
      { error: "Service role key not configured" },
      { status: 500 }
    );

  const body = await request.json();
  const { email, password } = body;

  if (!email || !password) {
    return NextResponse.json(
      { error: "Email and password are required" },
      { status: 400 }
    );
  }

  if (password.length < 6) {
    return NextResponse.json(
      { error: "Password must be at least 6 characters" },
      { status: 400 }
    );
  }

  const { data, error } = await service.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (error)
    return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json(
    {
      id: data.user.id,
      email: data.user.email,
      created_at: data.user.created_at,
    },
    { status: 201 }
  );
}

/** DELETE /api/admin/users — delete a user by id */
export async function DELETE(request: Request) {
  const supabase = getAuthClient(request);
  if (!supabase)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const service = getServiceClient();
  if (!service)
    return NextResponse.json(
      { error: "Service role key not configured" },
      { status: 500 }
    );

  const { searchParams } = new URL(request.url);
  const targetId = searchParams.get("id");

  if (!targetId)
    return NextResponse.json(
      { error: "User id is required" },
      { status: 400 }
    );

  // Prevent self-deletion
  if (targetId === user.id)
    return NextResponse.json(
      { error: "You cannot delete your own account" },
      { status: 400 }
    );

  const { error } = await service.auth.admin.deleteUser(targetId);

  if (error)
    return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json({ success: true });
}
