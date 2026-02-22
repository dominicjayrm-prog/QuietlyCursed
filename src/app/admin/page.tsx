"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabase } from "@/lib/supabase/client";
import { supabaseEnabled } from "@/lib/supabase/enabled";
import AdminDashboard from "@/components/admin/AdminDashboard";

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

    supabase.auth.getUser().then(({ data: { user } }: { data: { user: { email?: string } | null } }) => {
      if (!user) {
        router.replace("/admin/login");
      } else {
        setUserEmail(user.email ?? "Admin");
      }
      setChecking(false);
    });
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
        <p className="text-sm text-white/30">Checking authentication...</p>
      </section>
    );
  }

  if (!userEmail) return null;

  return <AdminDashboard userEmail={userEmail} />;
}
