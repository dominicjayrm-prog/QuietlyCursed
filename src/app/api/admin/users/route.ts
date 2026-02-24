import { NextResponse } from "next/server";
import { requireAuth, getServiceClient, safeError } from "@/lib/api-helpers";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

/** GET /api/admin/users — list all auth users */
export async function GET(request: Request) {
  const limited = rateLimit(`admin-users-get:${getClientIp(request)}`, {
    limit: 15,
    windowMs: 60_000,
  });
  if (limited) return limited;

  const auth = await requireAuth(request);
  if (auth.error) return auth.error;

  const service = getServiceClient();
  if (!service)
    return NextResponse.json({ error: "Server misconfigured" }, { status: 500 });

  const {
    data: { users },
    error,
  } = await service.auth.admin.listUsers();

  if (error) return safeError("admin/users GET", error);

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
  const limited = rateLimit(`admin-users-post:${getClientIp(request)}`, {
    limit: 5,
    windowMs: 60_000,
  });
  if (limited) return limited;

  const auth = await requireAuth(request);
  if (auth.error) return auth.error;

  const service = getServiceClient();
  if (!service)
    return NextResponse.json({ error: "Server misconfigured" }, { status: 500 });

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

  if (error) {
    console.error("[admin/users POST]", error.message);
    return NextResponse.json(
      { error: "Failed to create user. The email may already be in use." },
      { status: 400 }
    );
  }

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
  const limited = rateLimit(`admin-users-del:${getClientIp(request)}`, {
    limit: 5,
    windowMs: 60_000,
  });
  if (limited) return limited;

  const auth = await requireAuth(request);
  if (auth.error) return auth.error;

  const service = getServiceClient();
  if (!service)
    return NextResponse.json({ error: "Server misconfigured" }, { status: 500 });

  const { searchParams } = new URL(request.url);
  const targetId = searchParams.get("id");

  if (!targetId)
    return NextResponse.json(
      { error: "User id is required" },
      { status: 400 }
    );

  // Prevent self-deletion
  if (targetId === auth.user.id)
    return NextResponse.json(
      { error: "You cannot delete your own account" },
      { status: 400 }
    );

  const { error } = await service.auth.admin.deleteUser(targetId);

  if (error) {
    console.error("[admin/users DELETE]", error.message);
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 400 }
    );
  }

  return NextResponse.json({ success: true });
}
