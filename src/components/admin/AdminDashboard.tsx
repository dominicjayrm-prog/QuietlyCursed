"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabase } from "@/lib/supabase/client";
import AtlasManager from "./AtlasManager";
import GalleryManager from "./GalleryManager";
import QuizAnalytics from "./QuizAnalytics";
import TrafficAnalytics from "./TrafficAnalytics";
import UtmLinkGenerator from "./UtmLinkGenerator";

const TABS = ["Atlas", "Gallery", "Quiz Analytics", "Traffic & UTM", "Link Generator"] as const;
type Tab = (typeof TABS)[number];

export default function AdminDashboard({ userEmail }: { userEmail: string }) {
  const [activeTab, setActiveTab] = useState<Tab>("Atlas");
  const router = useRouter();

  async function handleSignOut() {
    const supabase = getSupabase()!;
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <section className="mx-auto max-w-6xl px-6 py-10">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
          <p className="text-sm text-white/30">{userEmail}</p>
        </div>
        <button
          onClick={handleSignOut}
          className="rounded-lg border border-white/10 px-4 py-2 text-xs font-medium uppercase tracking-wider text-white/40 transition-colors hover:border-white/20 hover:text-white/60 cursor-pointer"
        >
          Sign Out
        </button>
      </div>

      {/* Tabs */}
      <div className="mb-8 flex gap-1 rounded-lg border border-white/5 bg-white/[0.02] p-1 overflow-x-auto">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`shrink-0 rounded-md px-4 py-2.5 text-sm font-medium transition-all cursor-pointer ${
              activeTab === tab
                ? "bg-cyan-500/10 text-cyan-400"
                : "text-white/40 hover:text-white/60"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === "Atlas" && <AtlasManager />}
      {activeTab === "Gallery" && <GalleryManager />}
      {activeTab === "Quiz Analytics" && <QuizAnalytics />}
      {activeTab === "Traffic & UTM" && <TrafficAnalytics />}
      {activeTab === "Link Generator" && <UtmLinkGenerator siteDomain="quietlycursed.com" />}
    </section>
  );
}
