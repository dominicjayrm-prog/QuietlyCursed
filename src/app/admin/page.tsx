"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabase } from "@/lib/supabase/client";
import { supabaseEnabled } from "@/lib/supabase/enabled";
import AdminDashboard from "@/components/admin/AdminDashboard";
import SessionTracker from "@/components/SessionTracker";

export default function AdminPage() {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [checking, setChecking] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!supabaseEnabled) {
      setChecking(false);
      return;
    }

    const supabase = getSupabase();
    if (!supabase) {
      setChecking(false);
      return;
    }

    // Timeout: redirect to login if auth check takes longer than 5s
    const timeout = setTimeout(() => {
      setChecking(false);
      router.replace("/admin/login");
    }, 5000);

    // Use getSession() first — reads from cookies, no network request
    supabase.auth
      .getSession()
      .then(({ data: { session } }: { data: { session: { user?: { email?: string } } | null } }) => {
        clearTimeout(timeout);
        if (!session) {
          router.replace("/admin/login");
        } else {
          setUserEmail(session.user?.email ?? "Admin");
        }
        setChecking(false);
      })
      .catch(() => {
        clearTimeout(timeout);
        setChecking(false);
        router.replace("/admin/login");
      });

    return () => clearTimeout(timeout);
  }, [router]);

  if (!supabaseEnabled) {
    return (
      <section className="flex min-h-[80vh] items-center justify-center px-6">
        <div className="text-center">
          <h1 className="mb-4 text-2xl font-bold text-white">Admin Panel</h1>
          <p className="text-white/50">
            Supabase is not configured. Add your environment variables to{" "}
            <code className="text-cyan-400">.env.local</code> and restart the server.
          </p>
        </div>
      </section>
    );
  }

  if (checking) {
    return (
      <section className="flex min-h-[80vh] items-center justify-center px-6">
        <p className="text-sm text-white/30 animate-pulse">Checking authentication...</p>
      </section>
    );
  }

  if (!userEmail) return null;

  return (
    <>
      <SessionTracker />
      <AdminDashboard userEmail={userEmail} />
    </>
  );
}
