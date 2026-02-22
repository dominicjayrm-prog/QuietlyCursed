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
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

interface RouteContext {
  params: Promise<{ id: string }>;
}

/** PATCH /api/admin/atlas/[id] — update a post */
export async function PATCH(request: Request, context: RouteContext) {
  const supabase = getAuthClient(request);
  if (!supabase)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await context.params;
  const body = await request.json();

  const service = getServiceClient();
  const { data, error } = await service
    .from("atlas_posts")
    .update(body)
    .eq("id", id)
    .select()
    .single();

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json(data);
}

/** DELETE /api/admin/atlas/[id] — delete a post */
export async function DELETE(request: Request, context: RouteContext) {
  const supabase = getAuthClient(request);
  if (!supabase)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await context.params;

  const service = getServiceClient();
  const { error } = await service.from("atlas_posts").delete().eq("id", id);

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true });
}
