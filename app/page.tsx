"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase";
import StickerCard from "@/components/ui/StickerCard";
import { GridSkeleton } from "@/components/ui/Skeleton";
import { Sparkles, TrendingUp, Clock, ChevronRight } from "lucide-react";

export default function HomePage() {
  const [tab, setTab] = useState<"trending" | "latest">("trending");
  const [stickers, setStickers] = useState<any[]>([]);
  const [creators, setCreators] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function load() {
      setLoading(true);
      const { data } = await supabase
        .from("stickers")
        .select("*, profiles(*)")
        .limit(12);
      setStickers(data || []);
      const { data: users } = await supabase
        .from("profiles")
        .select("*")
        .order("follower_count", { ascending: false })
        .limit(4);
      setCreators(users || []);
      setLoading(false);
    }
    load();
  }, []);

  const displayed = tab === "trending"
    ? [...stickers].sort((a, b) => b.download_count - a.download_count)
    : [...stickers].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden py-20 px-4 text-center" style={{ background: "linear-gradient(135deg, #0F0F1A 0%, #1a0a2e 50%, #0a1628 100%)" }}>
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle at 30% 50%, #7C3AED 0%, transparent 50%), radial-gradient(circle at 70% 50%, #06B6D4 0%, transparent 50%)" }} />
        <div className="relative max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium mb-4" style={{ background: "rgba(124,58,237,0.2)", border: "1px solid rgba(124,58,237,0.4)", color: "var(--primary-light)" }}>
            <Sparkles size={12} /> The internet&apos;s favourite sticker community
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-4 leading-tight">
            Stickers that <span style={{ color: "var(--primary-light)" }}>actually</span> slap
          </h1>
          <p className="text-lg mb-8" style={{ color: "var(--muted)" }}>Upload your art. Download what you love. Build your collection.</p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link href="/search" className="px-6 py-3 rounded-xl font-semibold text-white transition hover:opacity-90" style={{ background: "var(--primary)" }}>Browse Stickers</Link>
            <Link href="/upload" className="px-6 py-3 rounded-xl font-semibold transition hover:opacity-90" style={{ background: "var(--card)", border: "1px solid var(--border)", color: "var(--text)" }}>Upload Yours</Link>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex gap-8">
          <div className="flex-1 min-w-0">
            <div className="flex gap-1 p-1 rounded-xl w-fit mb-6" style={{ background: "var(--card)" }}>
              {([["trending", TrendingUp, "Trending"], ["latest", Clock, "Latest"]] as const).map(([key, Icon, label]) => (
                <button key={key} onClick={() => setTab(key)} className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition" style={{ background: tab === key ? "var(--primary)" : "transparent", color: tab === key ? "#fff" : "var(--muted)" }}>
                  <Icon size={15} />{label}
                </button>
              ))}
            </div>
            {loading ? <GridSkeleton count={8} /> : (
              displayed.length === 0 ? (
                <div className="text-center py-20" style={{ color: "var(--muted)" }}>
                  <p className="text-lg mb-2">No stickers yet!</p>
                  <Link href="/upload" className="text-sm px-4 py-2 rounded-xl" style={{ background: "var(--primary)", color: "#fff" }}>Be the first to upload</Link>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {displayed.map(s => <StickerCard key={s.id} sticker={s} uploader={s.profiles} />)}
                </div>
              )
            )}
          </div>

          <aside className="hidden lg:block w-64 shrink-0">
            <div className="rounded-2xl p-4 sticky top-20" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
              <p className="font-semibold text-sm mb-4 uppercase tracking-wider" style={{ color: "var(--muted)" }}>Top Creators</p>
              <div className="space-y-3">
                {creators.map(u => (
                  <Link key={u.id} href={`/user/${u.username}`} className="flex items-center gap-3 hover:opacity-80 transition">
                    <img src={u.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.id}`} alt={u.username} className="w-9 h-9 rounded-full border-2" style={{ borderColor: "var(--primary)" }} />
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">@{u.username}</p>
                      <p className="text-xs" style={{ color: "var(--muted)" }}>{u.follower_count?.toLocaleString() || 0} followers</p>
                    </div>
                    <ChevronRight size={14} className="ml-auto shrink-0" style={{ color: "var(--muted)" }} />
                  </Link>
                ))}
                {creators.length === 0 && <p className="text-xs" style={{ color: "var(--muted)" }}>No creators yet.</p>}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
